module Gamepad where

import Prelude (Unit)
import Effect (Effect)

data Control = Up | Down | Left | Right | LeftAxisH | LeftAxisV

foreign import subscribe :: Control -> (Number -> Effect Unit) -> Effect (Effect Unit)
