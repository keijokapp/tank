module Tank (main) where

import Prelude (Unit, bind, discard, map, negate, pure, show, unit, (*), (+), (-), (/), (<<<), (>), (>>=))
import Partial.Unsafe (unsafePartial)
import Data.Maybe (Maybe(Just), fromJust)
import Effect (Effect)
import Foreign.Object as FO
import Data.Int (round)
import Data.Number (atan2, cos, sin, pi)
import Web.DOM.Element as Element
import Web.DOM.ParentNode (ParentNode, QuerySelector(QuerySelector), querySelector) as ParentNode
import Web.HTML (window)
import Web.HTML.Window (document)
import Web.HTML.HTMLDocument (toParentNode) as HTMLDocument
import PendingPeer as PendingPeer
import Signaling (PeerType(Tank))
import USB (send)

main :: Effect Unit
main = do
  peer <- PendingPeer.createPendingPeer Tank
  PendingPeer.setSendAudio peer true
  PendingPeer.setSendVideo peer true
  setJoystick <- initJoystick
  _ <- PendingPeer.subscribeMessage peer (set setJoystick)
  pure unit
  where
    set setJoystick message = do
      set' setJoystick (FO.lookup "joystickH" message) (FO.lookup "joystickV" message)
    set' setJoystick (Just h) (Just v) = do
      setJoystick h v
      setControls h v
    set' _ _ _ = pure unit

setControls :: Number -> Number -> Effect Unit
setControls h v = do
  let r = 100.0
      distance = h * h + v * v
      angle = atan2 h v
      cl = cos (angle - pi / 4.0)
      cr = cos (angle + pi / 4.0)
      realDistance = if distance > 1.0 then 1.0 else distance
      left = round ((-cl * realDistance + 1.0) * 8.0)
      right = round ((-cr * realDistance + 1.0) * 8.0)
      byte = (if left > 15 then 15 else left) * 16 + (if right > 15 then 15 else right)
  send byte

unsafeFromJust :: forall a. Maybe a -> a
unsafeFromJust x = unsafePartial (fromJust x)

querySelector :: String -> ParentNode.ParentNode -> Effect Element.Element
querySelector selector = map unsafeFromJust <<< ParentNode.querySelector (ParentNode.QuerySelector selector)

initJoystick :: Effect (Number -> Number -> Effect Unit)
initJoystick = do
  document <- window >>= document
  joystickElement <- querySelector "#joystick-position" (HTMLDocument.toParentNode document)
  pure (set joystickElement)
  where
    r = 100.0
    c = 150.0
    set joystickElement realX realY = do
      let distance = realX * realX + realY * realY
          angle = atan2 realY realX
          x = if distance > 1.0 then cos angle else realX
          y = if distance > 1.0 then sin angle else realY
          canvasX = x * r + c
          canvasY = c - y * r
      Element.setAttribute "cx" (show canvasX) joystickElement
      Element.setAttribute "cy" (show canvasY) joystickElement
