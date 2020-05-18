module Operator where

import Prelude
import Capture (subscribeAudio)
import Partial.Unsafe (unsafePartial)
import Data.Int (toNumber)
import Data.Array (elem)
import Data.Argonaut.Core (fromObject, fromNumber)
import Data.Either (Either(Left, Right))
import Data.FoldableWithIndex (foldWithIndexM)
import Data.Map (Map)
import Data.Map as Map
import Data.Set (Set)
import Data.Set as Set
import Data.Maybe (Maybe(Nothing, Just), maybe, fromJust)
import Effect (Effect)
import Effect.Class (liftEffect)
import Effect.Console (warn)
import Effect.Exception (Error)
import Effect.Promise (Promise, runPromise)
import Effect.Promise (class Deferred, promise) as Promise
import Effect.Promise.Console (warn) as Promise
import Effect.Ref (Ref)
import Effect.Ref as Ref
import Effect.Timer (setTimeout, clearTimeout)
import Foreign.Object (Object)
import Foreign.Object as FO
import Math (atan2, cos, sin)
import Web.Event.Event (EventType(EventType), preventDefault)
import Web.Event.EventTarget (eventListener, addEventListener, EventListener)
import Web.UIEvent.PointerEvent (PointerEvent)
import Web.UIEvent.PointerEvent as PointerEvent
import Web.UIEvent.KeyboardEvent (KeyboardEvent)
import Web.UIEvent.KeyboardEvent as KeyboardEvent
import Web.DOM.Element (setAttribute)
import Web.DOM.ParentNode (QuerySelector(QuerySelector), querySelector)
import Web.DOM.Document (Document)
import Web.DOM.Document as Document
import Web.HTML (window)
import Web.HTML.HTMLDocument (HTMLDocument)
import Web.HTML.HTMLDocument as HTMLDocument
import Web.HTML.HTMLElement (HTMLElement, toElement, toEventTarget, fromElement, getBoundingClientRect)
import Web.HTML.HTMLElement as HTMLElement
import Web.HTML.Window (document)
import Web.HTML.HTMLDocument (toParentNode)
import PointerEvents (setPointerCapture, releasePointerCapture)
import Peer (RequestCallback, Peer, createPeer)
import Peer as Peer
import PeerConnection (createPeerConnection)
import Playback (setPlaybackVideo, setPlaybackAudio)
import Signaling (PeerId, PeerType(Operator, Tank), peerId, subscribePeer, sendSdp, sendIce, subscribeSdp, subscribeIce)
import Track (VideoTrack)
import Gamepad (GamepadControl)
import Util (nextTick)

newtype PendingPeer = PendingPeer (Ref.Ref (Either { requestSubscribers :: Map Int RequestCallback, sendAudio :: Boolean, subscriberId :: Int } { requestSubscribers :: Map Int (Effect Unit), peer :: Peer }))
data JoystickCoordinates = JoystickCoordinates Number Number

main :: Effect Unit
main = do
  peer <- initPendingPeer
  setControl <- initControls (sendMessage peer)
  pure unit

initPendingPeer :: Effect PendingPeer
initPendingPeer = do
  pendingPeer <- Ref.new $ Left {
    requestSubscribers: Map.empty,
    sendAudio: false,
    subscriberId: 0
  }
  runPromise (onPeer (PendingPeer pendingPeer)) (const (pure unit)) (waitForPeer (peerId Operator))
  pure (PendingPeer pendingPeer)
  where
    onPeer :: PendingPeer -> Peer -> Effect Unit
    onPeer (PendingPeer pendingPeerRef) peer = do
      pendingPeer <- Ref.read pendingPeerRef
      requestSubscribers <- handlePendingPeer peer pendingPeer
      Ref.write (Right { peer, requestSubscribers }) pendingPeerRef
      pure unit
    handlePendingPeer peer (Left pendingPeer) = do
      Peer.setSendAudio peer pendingPeer.sendAudio
      foldWithIndexM (addSubscriber peer) Map.empty pendingPeer.requestSubscribers
    handlePendingPeer peer (Right pendingPeer) = pure (Map.empty) -- error really
    addSubscriber peer id requestSubscribers requestCallback = do
      unsubscribe <- Peer.subscribeRequest peer requestCallback
      pure (Map.insert id unsubscribe requestSubscribers)

waitForPeer :: PeerId -> (Promise.Deferred => Promise Peer)
waitForPeer localPeer = Promise.promise callback
  where
    callback :: (Peer -> Effect Unit) -> (Error -> Effect Unit) -> Effect Unit
    callback resolve _ = do
      unsubscribe <- Ref.new $ pure unit
      unsubscribeFn <- subscribePeer Operator localPeer (onPeer unsubscribe resolve)
      Ref.write unsubscribeFn unsubscribe
    onPeer :: Ref.Ref (Effect Unit) -> (Peer -> Effect Unit) -> PeerType -> PeerId -> Effect Unit
    onPeer unsubscribe resolve Tank remotePeer = do
      join $ Ref.read unsubscribe
      peer <- initConnection localPeer remotePeer
      resolve peer
    onPeer _ _ Operator _ = pure unit

initConnection :: PeerId -> PeerId -> Effect Peer
initConnection localPeer remotePeer = do
  pc <- createPeerConnection
    Nothing
    (sendSdp localPeer remotePeer)
    (sendIce localPeer remotePeer)
    (subscribeSdp remotePeer localPeer)
    (subscribeIce remotePeer localPeer)
  createPeer
    pc
    setPlaybackVideo
    setPlaybackAudio
    subscribeVideo
    subscribeAudio
  where
    subscribeVideo :: (VideoTrack -> Effect Unit) -> Effect (Effect Unit)
    subscribeVideo subscriber = do
      warn "Operator should not subscribe to video"
      pure $ pure unit

initControls :: (Object Number -> Effect Unit) -> Effect (String -> Maybe Number -> Effect Unit)
initControls sendMessage' = do
  timeoutRef <- Ref.new Nothing
  nextCommandRef <- Ref.new FO.empty
  needsSendRef <- Ref.new false
  pure (setControl timeoutRef nextCommandRef needsSendRef)
  where
    sendControls timeoutRef nextCommandRef = do
      timer <- Ref.read timeoutRef
      case timer of
        Just t -> do
          clearTimeout t
          Ref.write Nothing timeoutRef
        Nothing -> pure unit
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

sendMessage :: PendingPeer -> Object Number -> Effect Unit
sendMessage (PendingPeer pendingPeer) message =
  Ref.read pendingPeer >>= sendMessage'
  where
    sendMessage' (Left _) = warn "Peer is not available"
    sendMessage' (Right { peer }) = Peer.sendMessage peer (fromObject (fromNumber <$> message))

sendRequest :: Promise.Deferred => PendingPeer -> Object Number -> Promise Unit
sendRequest (PendingPeer pendingPeer) request = do
  peer <- liftEffect (Ref.read pendingPeer)
  sendRequest' peer
  where
    sendRequest' :: Promise.Deferred => _ -> Promise Unit
    sendRequest' (Left _) = Promise.warn "Peer is not available"
    sendRequest' (Right { peer }) = do
      _ <-Peer.sendRequest peer (fromObject (fromNumber <$> request))
      pure unit

initJoystick :: (String -> Maybe Number -> Effect Unit) -> Effect (JoystickCoordinates -> Effect Unit)
initJoystick getControl' = do
  document <- window >>= document
  joystickElement <- unsafePartial <<< (\x -> fromJust x) <$> querySelector (QuerySelector "joystick-position") (toParentNode document)
  zeroTimeoutRef <- Ref.new Nothing
  pure (set joystickElement zeroTimeoutRef)
  where
    r = 100.0
    c = 150.0
    setX = getControl' "joystickH"
    setY = getControl' "joystickV"
    set joystickElement zeroTimeoutRef realCoordinates@(JoystickCoordinates realX realY) = do
      let distance = realX * realX + realY * realY
          (JoystickCoordinates x y) = if distance < 0.1 then JoystickCoordinates 0.0 0.0 else if distance > 1.0 then let angle = atan2 realY realX in JoystickCoordinates (cos angle) (sin angle) else realCoordinates
          canvasX = x * r + c
          canvasY = c - y * r
      setAttribute "cx" (show canvasX) joystickElement
      setAttribute "cy" (show canvasY) joystickElement
      setX (Just x)
      setY (Just y)
      oldTimeoutId <- Ref.read zeroTimeoutRef
      maybe (pure unit) clearTimeout oldTimeoutId
      timeoutId <- setTimeout 1000 do
        setX Nothing
        setY Nothing
      Ref.write (Just timeoutId) zeroTimeoutRef

initActuator :: String -> (String -> Maybe Number -> Effect Unit) -> Effect (Number -> Effect Unit)
initActuator id getControl' = do
  document <- window >>= document
  up <- unsafePartial <<< (\x -> fromJust x) <$> querySelector (QuerySelector (id <> "-up")) (toParentNode document)
  down <- unsafePartial <<< (\x -> fromJust x) <$> querySelector (QuerySelector (id <> "-down")) (toParentNode document)
  zeroTimeoutRef <- Ref.new Nothing
  pure (set up down zeroTimeoutRef)
  where
    setActuator = getControl' id
    set up down zeroTimeoutRef value = do
      oldTimeoutId <- Ref.read zeroTimeoutRef
      maybe (pure unit) clearTimeout oldTimeoutId
      setAttribute "fill" (if value > 0.0 then "orange" else "gray") up
      setAttribute "fill" (if value < 0.0 then "orange" else "gray") down
      setActuator (Just (if value < 0.0 then -1.0 else if value > 0.0 then 1.0 else 0.0))
      unless (value == 0.0) do
        timeoutId <- setTimeout 1000 (setActuator Nothing)
        Ref.write (Just timeoutId) zeroTimeoutRef

initJoystickControl :: String
                    -> String
                    -> String
                    -> String
                    -> GamepadControl
                    -> GamepadControl
                    -> (JoystickCoordinates -> Effect Unit)
                    -> Effect Unit
initJoystickControl up down left right axisH axisV set = do
  document <- window >>= document
  joystick <- (unsafePartial <<< \x -> fromJust x) <<< (_ >>= HTMLElement.fromElement) <$> querySelector (QuerySelector "joystick") (toParentNode document)
  setByMouseRef <- Ref.new false
  keyboardStateRef <- Ref.new Set.empty
  addPointerEventListener "pointerdown" (onPointerDown joystick setByMouseRef) joystick
  addPointerEventListener "pointermove" (onPointerMove joystick setByMouseRef) joystick
  addPointerEventListener "pointerup" (onPointerUp joystick setByMouseRef keyboardStateRef) joystick
  addKeyboardEventListener "keydown" (onKeyDown setByMouseRef keyboardStateRef) document
  addKeyboardEventListener "keyup" (onKeyUp setByMouseRef keyboardStateRef) document
  pure unit
  where
    joystickCenter = 150.0
    joystickRadius = 100.0
    addPointerEventListener eventName handler target = do
      listener <- eventListener (handler <<< (unsafePartial <<< \x -> fromJust x) <<< PointerEvent.fromEvent)
      addEventListener (EventType eventName) listener false (toEventTarget target)
    addKeyboardEventListener eventName handler document = do
      listener <- eventListener (handler <<< (unsafePartial <<< \x -> fromJust x) <<< KeyboardEvent.fromEvent)
      addEventListener (EventType eventName) listener false (HTMLDocument.toEventTarget document)
    -- pointer events
    onPointerDown :: HTMLElement -> Ref Boolean -> PointerEvent -> Effect Unit
    onPointerDown joystick setByMouseRef event = do
      JoystickCoordinates x y <- joystickCoordinatesFromEvent joystick event
      when (x * x + y * y <= 2.1) do
        setPointerCapture (PointerEvent.pointerId event) (HTMLElement.toElement joystick)
        set (JoystickCoordinates x y)
        Ref.write true setByMouseRef
    onPointerMove :: HTMLElement -> Ref Boolean -> PointerEvent -> Effect Unit
    onPointerMove joystick setByMouseRef event = Ref.read setByMouseRef >>= flip when (joystickCoordinatesFromEvent joystick event >>= set)
    onPointerUp :: HTMLElement -> Ref Boolean -> Ref (Set String) -> PointerEvent -> Effect Unit
    onPointerUp joystick setByMouseRef keyboardStateRef event = Ref.read setByMouseRef >>= flip when (resetMouseInput setByMouseRef keyboardStateRef)
    joystickCoordinatesFromEvent joystick event = do
      rect <- getBoundingClientRect joystick
      let offsetX = toNumber (PointerEvent.clientX event) - rect.left
          offsetY = toNumber (PointerEvent.clientY event) - rect.top
          x = (offsetX - joystickCenter) / joystickRadius
          y = (joystickCenter - offsetY) / joystickRadius
      pure (JoystickCoordinates x y)
    -- keyboard events
    onKeyDown setByMouseRef keyboardStateRef event = do
      let keyCode = KeyboardEvent.code event
      when (keyCode `elem` [up, down, left, right]) $ do
        preventDefault (KeyboardEvent.toEvent event)
        keyboardState <- Ref.read keyboardStateRef
        unless (Set.member keyCode keyboardState) $ do
          Ref.write (Set.insert keyCode keyboardState) keyboardStateRef
          setByMouse <- Ref.read setByMouseRef
          unless setByMouse (setFromKeyboard keyboardStateRef)
    onKeyUp setByMouseRef keyboardStateRef event = do
      let keyCode = KeyboardEvent.code event
      when (keyCode `elem` [up, down, left, right]) $ do
        preventDefault (KeyboardEvent.toEvent event)
        keyboardState <- Ref.read keyboardStateRef
        when (Set.member keyCode keyboardState) $ do
          Ref.write (Set.delete keyCode keyboardState) keyboardStateRef
          setByMouse <- Ref.read setByMouseRef
          unless setByMouse (setFromKeyboard keyboardStateRef)
    resetMouseInput :: Ref Boolean -> Ref (Set String) -> Effect Unit
    resetMouseInput setByMouseRef keyboardStateRef = do
      Ref.write false setByMouseRef
      setFromKeyboard keyboardStateRef
    setFromGamepad = pure unit -- TODO
    setFromKeyboard :: Ref (Set String) -> Effect Unit
    setFromKeyboard keyboardStateRef = do
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
        else setFromGamepad
    onBlur setByMouseRef keyboardStateRef = do
      keyboardState <- Ref.read keyboardStateRef
      setByMouse <- Ref.read setByMouseRef
      Ref.write Set.empty keyboardStateRef
      when (hasKeyboardInputs keyboardState && not setByMouse) (setFromKeyboard keyboardStateRef)
    hasKeyboardInputs keyboardState =
      up `Set.member` keyboardState ||
      down `Set.member` keyboardState ||
      left `Set.member` keyboardState ||
      right `Set.member` keyboardState

