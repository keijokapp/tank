module Main where

import Prelude (Unit, show, (>>=), (<<<), (>>>))
import Effect (Effect)
import Effect.Console (log)
import Data.Maybe

data Loom = Koer | Kass

foreign import loom :: Loom -> Loom -> Effect Unit

main :: Effect Unit
main = loom Koer Kass
