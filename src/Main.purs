module Main where

import Prelude (Unit, show, (>>=), (<<<), (>>>))
import Effect (Effect)
import Data.Maybe
import Effect.Console (log)
import Data.Maybe

data Loom = Koer | Kass

foreign import loom :: Loom -> Loom -> Int -> Maybe Int -> Effect Unit

main :: Effect Unit
main = loom Koer Kass 3 Nothing
