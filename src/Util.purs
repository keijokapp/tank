module Util where

import Prelude (Unit, pure, unit, bind, discard)
import Effect (Effect)
import Data.Maybe (Maybe(Just, Nothing))
import Effect.Ref as Ref
import Effect.Timer (TimeoutId, clearTimeout)

foreign import nextTick :: Effect Unit -> Effect Unit
foreign import timestamp :: Effect Int

clearTimeoutRef :: Ref.Ref (Maybe TimeoutId) -> Effect Unit
clearTimeoutRef timeoutRef = do
  timer <- Ref.read timeoutRef
  case timer of
    Just t -> do
      clearTimeout t
      Ref.write Nothing timeoutRef
    Nothing -> pure unit
