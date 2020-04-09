 module Standalone (main) where

import Prelude (Unit, bind, discard, map, flip, negate, not, pure, show, unit, unless, when, ($), (&&), (*), (+), (-), (/), (<), (<<<), (<=), (<>), (==), (>), (>>=), (||))
import Partial.Unsafe (unsafePartial)
import Data.Int (toNumber, round)
import Data.Set as Set
import Data.Maybe (Maybe(Nothing, Just), fromJust)
import Data.Tuple (Tuple(Tuple))
import Effect (Effect)
import Effect.Ref as Ref
import Effect.Timer (setTimeout)
import Foreign.Object (Object)
import Foreign.Object as FO
import Data.Number (atan2, cos, sin, pi)
import Web.Event.Event (EventType(EventType))
import Web.Event.EventTarget (eventListener, addEventListener)
import Web.PointerEvents.PointerEvent as PointerEvent
import Web.DOM.Element (Element, setAttribute, toEventTarget) as Element
import Web.DOM.ParentNode (ParentNode, QuerySelector(QuerySelector), querySelector) as ParentNode
import Web.HTML (window)
import Web.HTML.Window (document)
import Web.HTML.HTMLDocument (toParentNode) as HTMLDocument
import Web.CSSOMView.Element (getBoundingClientRect) as Element
import Web.Geometry.DOMRect as DOMRect
import PointerEvents (setPointerCapture)
import Keyboard as Keyboard
import Gamepad as Gamepad
import Util (nextTick, clearTimeoutRef)
import USB (send)

data JoystickCoordinates = JoystickCoordinates Number Number

main :: Effect Unit
main = do
  setControl <- initControls (set setControls)
  setJoystick <- initJoystick setControl
  setPrimary <- initActuator "primary" setControl
  setSecondary <- initActuator "secondary" setControl
  initJoystickControl "ArrowUp" "ArrowDown" "ArrowLeft" "ArrowRight" Gamepad.LeftAxisH Gamepad.LeftAxisV setJoystick
  initActuatorControl "primary" "KeyW" "KeyS" Gamepad.Up Gamepad.Down setPrimary
  initActuatorControl "secondary" "KeyA" "KeyD" Gamepad.Left Gamepad.Right setSecondary
  pure unit
  where
    set setControls' message = do
      set' setControls' (FO.lookup "joystickH" message) (FO.lookup "joystickV" message)
    set' setControls' (Just h) (Just v) = setControls' h v
    set' _ _ _ = pure unit

setControls :: Number -> Number -> Effect Unit
setControls h v = do
  let distance = h * h + v * v
      angle = atan2 h v
      cl = cos (angle - pi / 4.0)
      cr = cos (angle + pi / 4.0)
      realDistance = if distance > 1.0 then 1.0 else distance
      left = round ((-cl * realDistance + 1.0) * 8.0)
      right = round ((-cr * realDistance + 1.0) * 8.0)
      byte = (if left > 15 then 15 else left) * 16 + (if right > 15 then 15 else right)
  send byte

initControls :: (Object Number -> Effect Unit) -> Effect (String -> Maybe Number -> Effect Unit)
initControls sendMessage' = do
  timeoutRef <- Ref.new Nothing
  nextCommandRef <- Ref.new FO.empty
  needsSendRef <- Ref.new false
  pure (setControl timeoutRef nextCommandRef needsSendRef)
  where
    sendControls timeoutRef nextCommandRef = do
      clearTimeoutRef timeoutRef
      nextCommand <- Ref.read nextCommandRef
      unless (FO.isEmpty nextCommand) do
        sendMessage' nextCommand
        timeoutId <- setTimeout 400 (sendControls timeoutRef nextCommandRef)
        Ref.write (Just timeoutId) timeoutRef
    setControl timeoutRef nextCommandRef needsSendRef control (Just value) = do
      Ref.modify_ (FO.insert control value) nextCommandRef
      needsSend <- Ref.read needsSendRef
      unless needsSend do
        Ref.write true needsSendRef
        nextTick do
          Ref.write false needsSendRef
          sendControls timeoutRef nextCommandRef
    setControl _ nextCommandRef _ control Nothing =
      Ref.modify_ (FO.delete control) nextCommandRef

unsafeFromJust :: forall a. Maybe a -> a
unsafeFromJust x = unsafePartial (fromJust x)

querySelector :: String -> ParentNode.ParentNode -> Effect Element.Element
querySelector selector = map unsafeFromJust <<< ParentNode.querySelector (ParentNode.QuerySelector selector)

initJoystick :: (String -> Maybe Number -> Effect Unit) -> Effect (JoystickCoordinates -> Effect Unit)
initJoystick getControl' = do
  document <- window >>= document
  joystickElement <- querySelector "#joystick-position" (HTMLDocument.toParentNode document)
  zeroTimeoutRef <- Ref.new Nothing
  pure (set joystickElement zeroTimeoutRef)
  where
    r = 100.0
    c = 150.0
    setX = getControl' "joystickH"
    setY = getControl' "joystickV"
    set joystickElement zeroTimeoutRef realCoordinates@(JoystickCoordinates realX realY) = do
      let distance = realX * realX + realY * realY
          JoystickCoordinates x y = if distance < 0.1 then JoystickCoordinates 0.0 0.0 else if distance > 1.0 then let angle = atan2 realY realX in JoystickCoordinates (cos angle) (sin angle) else realCoordinates
          canvasX = x * r + c
          canvasY = c - y * r
      Element.setAttribute "cx" (show canvasX) joystickElement
      Element.setAttribute "cy" (show canvasY) joystickElement
      setX (Just x)
      setY (Just y)
      clearTimeoutRef zeroTimeoutRef
      when (x <= 0.0 && y <= 0.0) do
        timeoutId <- setTimeout 1000 do
          setX Nothing
          setY Nothing
        Ref.write (Just timeoutId) zeroTimeoutRef

initActuator :: String -> (String -> Maybe Number -> Effect Unit) -> Effect (Number -> Effect Unit)
initActuator id getControl' = do
  document <- window >>= document
  up <- querySelector ("#" <> id <> "-up") (HTMLDocument.toParentNode document)
  down <- querySelector ("#" <> id <> "-down") (HTMLDocument.toParentNode document)
  zeroTimeoutRef <- Ref.new Nothing
  pure (set up down zeroTimeoutRef)
  where
    setActuator = getControl' id
    set up down zeroTimeoutRef value = do
      clearTimeoutRef zeroTimeoutRef
      Element.setAttribute "fill" (if value > 0.0 then "orange" else "gray") up
      Element.setAttribute "fill" (if value < 0.0 then "orange" else "gray") down
      setActuator (Just (if value < 0.0 then -1.0 else if value > 0.0 then 1.0 else 0.0))
      when (value == 0.0) do
        timeoutId <- setTimeout 1000 (setActuator Nothing)
        Ref.write (Just timeoutId) zeroTimeoutRef

initJoystickControl :: String
                    -> String
                    -> String
                    -> String
                    -> Gamepad.Control
                    -> Gamepad.Control
                    -> (JoystickCoordinates -> Effect Unit)
                    -> Effect Unit
initJoystickControl up down left right axisH axisV set = do
  document <- window >>= document
  joystick <- querySelector "#joystick" (HTMLDocument.toParentNode document)
  setByMouseRef <- Ref.new false
  keyboardStateRef <- Ref.new Set.empty
  gamepadDeferredRef <- Ref.new false
  gamepadStateRef <- Ref.new (Tuple 0.0 0.0)

  addPointerEventListener "pointerdown" (onPointerDown joystick setByMouseRef) joystick
  addPointerEventListener "pointermove" (onPointerMove joystick setByMouseRef) joystick
  addPointerEventListener "pointerup" (onPointerUp joystick setByMouseRef keyboardStateRef gamepadStateRef) joystick

  _ <- Keyboard.subscribe up (onKeyChange setByMouseRef keyboardStateRef gamepadStateRef up)
  _ <- Keyboard.subscribe down (onKeyChange setByMouseRef keyboardStateRef gamepadStateRef down)
  _ <- Keyboard.subscribe left (onKeyChange setByMouseRef keyboardStateRef gamepadStateRef left)
  _ <- Keyboard.subscribe right (onKeyChange setByMouseRef keyboardStateRef gamepadStateRef right)

  _ <- Gamepad.subscribe axisH (\value -> do
    Tuple _ v <- Ref.read gamepadStateRef
    Ref.write (Tuple value v) gamepadStateRef
    setFromGamepadDeferred setByMouseRef keyboardStateRef gamepadStateRef gamepadDeferredRef
  )
  _ <- Gamepad.subscribe axisV (\value -> do
    Tuple h _ <- Ref.read gamepadStateRef
    Ref.write (Tuple h (-value)) gamepadStateRef
    setFromGamepadDeferred setByMouseRef keyboardStateRef gamepadStateRef gamepadDeferredRef
  )

  pure unit
  where
    joystickCenter = 150.0
    joystickRadius = 100.0
    -- pointer events
    addPointerEventListener eventName handler target = do
      listener <- eventListener (handler <<< unsafeFromJust <<< PointerEvent.fromEvent)
      addEventListener (EventType eventName) listener false (Element.toEventTarget target)
    joystickCoordinatesFromEvent joystick event = do
      rect <- Element.getBoundingClientRect joystick
      let offsetX = toNumber (PointerEvent.clientX event) - DOMRect.left rect
          offsetY = toNumber (PointerEvent.clientY event) - DOMRect.top rect
          x = (offsetX - joystickCenter) / joystickRadius
          y = (joystickCenter - offsetY) / joystickRadius
      pure (JoystickCoordinates x y)
    onPointerDown joystick setByMouseRef event = do
      JoystickCoordinates x y <- joystickCoordinatesFromEvent joystick event
      when (x * x + y * y <= 2.1) do
        setPointerCapture (PointerEvent.pointerId event) joystick
        set (JoystickCoordinates x y)
        Ref.write true setByMouseRef
    onPointerMove joystick setByMouseRef event = Ref.read setByMouseRef >>= flip when (joystickCoordinatesFromEvent joystick event >>= set)
    onPointerUp joystick setByMouseRef keyboardStateRef gamepadStateRef event = Ref.read setByMouseRef >>= flip when (resetMouseInput setByMouseRef keyboardStateRef gamepadStateRef)
    -- keyboard events
    onKeyChange setByMouseRef keyboardStateRef gamepadStateRef key isDown = do
      keyboardState <- Ref.read keyboardStateRef
      if isDown
      then
        unless (Set.member key keyboardState) $ do
          Ref.write (Set.insert key keyboardState) keyboardStateRef
          setByMouse <- Ref.read setByMouseRef
          unless setByMouse (setFromKeyboard keyboardStateRef gamepadStateRef)
      else
        when (Set.member key keyboardState) $ do
            Ref.write (Set.delete key keyboardState) keyboardStateRef
            setByMouse <- Ref.read setByMouseRef
            unless setByMouse (setFromKeyboard keyboardStateRef gamepadStateRef)
    -- misc
    resetMouseInput setByMouseRef keyboardStateRef gamepadStateRef = do
      Ref.write false setByMouseRef
      setFromKeyboard keyboardStateRef gamepadStateRef
    setFromGamepad gamepadStateRef = do
      Tuple h v <- Ref.read gamepadStateRef
      set (JoystickCoordinates h v)
    setFromGamepadDeferred setByMouseRef keyboardStateRef gamepadStateRef gamepadDeferredRef = do
      setByMouse <- Ref.read setByMouseRef
      keyboardState <- Ref.read keyboardStateRef
      gamepadDeferred <- Ref.read gamepadDeferredRef
      unless gamepadDeferred do
        Ref.write true gamepadDeferredRef
        nextTick do
          Ref.write false gamepadDeferredRef
          when (not setByMouse && not (hasKeyboardInputs keyboardState)) (setFromGamepad gamepadStateRef)
    setFromKeyboard keyboardStateRef gamepadStateRef = do
        keyboardState <- Ref.read keyboardStateRef
        if hasKeyboardInputs keyboardState
        then
          let upDown = if Set.member up keyboardState then 1.0 else 0.0
              downDown = if Set.member down keyboardState then 1.0 else 0.0
              leftDown = if Set.member left keyboardState then 1.0 else 0.0
              rightDown = if Set.member right keyboardState then 1.0 else 0.0
              x = rightDown - leftDown
              y = upDown - downDown
          in set (JoystickCoordinates x y)
        else setFromGamepad gamepadStateRef
    hasKeyboardInputs keyboardState =
      up `Set.member` keyboardState ||
      down `Set.member` keyboardState ||
      left `Set.member` keyboardState ||
      right `Set.member` keyboardState

initActuatorControl :: String
                    -> String
                    -> String
                    -> Gamepad.Control
                    -> Gamepad.Control
                    -> (Number -> Effect Unit)
                    -> Effect Unit
initActuatorControl id up down gamepadUp gamepadDown set = do
  document <- window >>= document
  actuatorUp <- querySelector ("#" <> id <> "-up") (HTMLDocument.toParentNode document)
  actuatorDown <- querySelector ("#" <> id <> "-down") (HTMLDocument.toParentNode document)
  setByMouseRef <- Ref.new false
  keyboardStateRef <- Ref.new Set.empty
  gamepadDeferredRef <- Ref.new false
  gamepadStateRef <- Ref.new (Tuple 0.0 0.0)

  addPointerEventListener "pointerdown" (onPointerDown actuatorUp setByMouseRef 1.0) actuatorUp
  addPointerEventListener "pointerdown" (onPointerDown actuatorDown setByMouseRef (-1.0)) actuatorDown
  addPointerEventListener "pointerup" (onPointerUp setByMouseRef keyboardStateRef gamepadStateRef) actuatorUp
  addPointerEventListener "pointerup" (onPointerUp setByMouseRef keyboardStateRef gamepadStateRef) actuatorDown

  _ <- Keyboard.subscribe up (onKeyChange setByMouseRef keyboardStateRef gamepadStateRef up)
  _ <- Keyboard.subscribe down (onKeyChange setByMouseRef keyboardStateRef gamepadStateRef down)

  _ <- Gamepad.subscribe gamepadUp (\up -> do
    Tuple _ down <- Ref.read gamepadStateRef
    Ref.write (Tuple up down) gamepadStateRef
    setFromGamepadDeferred setByMouseRef keyboardStateRef gamepadStateRef gamepadDeferredRef
  )
  _ <- Gamepad.subscribe gamepadDown (\down -> do
    Tuple up _ <- Ref.read gamepadStateRef
    Ref.write (Tuple up down) gamepadStateRef
    setFromGamepadDeferred setByMouseRef keyboardStateRef gamepadStateRef gamepadDeferredRef
  )

  pure unit
  where
    -- pointer events
    addPointerEventListener eventName handler target = do
      listener <- eventListener (handler <<< unsafeFromJust <<< PointerEvent.fromEvent)
      addEventListener (EventType eventName) listener false (Element.toEventTarget target)
    onPointerDown target setByMouseRef value event = do
      setPointerCapture (PointerEvent.pointerId event) target
      set value
      Ref.write true setByMouseRef
    onPointerUp setByMouseRef keyboardStateRef gamepadStateRef event = Ref.read setByMouseRef >>= flip when (resetMouseInput setByMouseRef keyboardStateRef gamepadStateRef)
    -- keyboard events
    onKeyChange setByMouseRef keyboardStateRef gamepadStateRef key isDown = do
      keyboardState <- Ref.read keyboardStateRef
      if isDown
      then
        unless (Set.member key keyboardState) $ do
          Ref.write (Set.insert key keyboardState) keyboardStateRef
          setByMouse <- Ref.read setByMouseRef
          unless setByMouse (setFromKeyboard keyboardStateRef gamepadStateRef)
      else
        when (Set.member key keyboardState) $ do
            Ref.write (Set.delete key keyboardState) keyboardStateRef
            setByMouse <- Ref.read setByMouseRef
            unless setByMouse (setFromKeyboard keyboardStateRef gamepadStateRef)
    -- misc
    resetMouseInput setByMouseRef keyboardStateRef gamepadStateRef = do
      Ref.write false setByMouseRef
      setFromKeyboard keyboardStateRef gamepadStateRef
    setFromGamepad gamepadStateRef = do
      Tuple up down <- Ref.read gamepadStateRef
      set (up - down)
    setFromGamepadDeferred setByMouseRef keyboardStateRef gamepadStateRef gamepadDeferredRef = do
      setByMouse <- Ref.read setByMouseRef
      keyboardState <- Ref.read keyboardStateRef
      gamepadDeferred <- Ref.read gamepadDeferredRef
      unless gamepadDeferred do
        Ref.write true gamepadDeferredRef
        nextTick do
          Ref.write false gamepadDeferredRef
          when (not setByMouse && not (hasKeyboardInputs keyboardState)) (setFromGamepad gamepadStateRef)
    setFromKeyboard keyboardStateRef gamepadStateRef = do
        keyboardState <- Ref.read keyboardStateRef
        if hasKeyboardInputs keyboardState
        then
          let upDown = if Set.member up keyboardState then 1.0 else 0.0
              downDown = if Set.member down keyboardState then 1.0 else 0.0
              value = upDown - downDown
          in set value
        else setFromGamepad gamepadStateRef
    hasKeyboardInputs keyboardState =
      up `Set.member` keyboardState ||
      down `Set.member` keyboardState
