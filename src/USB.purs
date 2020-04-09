module USB where

import Prelude (Unit)
import Effect (Effect)

foreign import send :: Int -> Effect Unit
