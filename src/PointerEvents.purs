module PointerEvents where

import Prelude (Unit)
import Effect (Effect)
import Web.DOM.Element (Element)

foreign import setPointerCapture :: Int -> Element -> Effect Unit
foreign import releasePointerCapture :: Int -> Element -> Effect Unit
foreign import hasPointerCapture :: Int -> Element -> Effect Boolean
