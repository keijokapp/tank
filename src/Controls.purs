module Gamepad where

import Prelude (Unit)
import Effect (Effect)

data GamepadControl = GamepadUp | GamepadDown | GamepadLeft | GamepadRight | GamepadLeftAxisH | GamepadRightAxisV

foreign import subscribeGamepad :: GamepadControl -> (Number -> Effect Unit) -> Effect (Effect Unit)
