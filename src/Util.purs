module Util where

import Prelude (Unit)
import Effect (Effect)

foreign import nextTick :: Effect Unit -> Effect Unit
