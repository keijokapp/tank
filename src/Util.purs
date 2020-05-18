module Util where

import Prelude (Unit, pure)
import Control.Monad (class Monad)
import Effect (Effect)
import Data.Maybe (Maybe, maybe)

foreign import nextTick :: Effect Unit -> Effect Unit
