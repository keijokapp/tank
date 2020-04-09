module Keyboard where

import Prelude (Unit)
import Effect (Effect)

foreign import subscribe :: String -> (Boolean -> Effect Unit) -> Effect (Effect Unit)
