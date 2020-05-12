module Capture where

import Prelude (Unit)
import Effect (Effect)
import Track (VideoTrack, AudioTrack)

foreign import setFlashLight :: VideoTrack -> Boolean -> Effect Unit

foreign import setFacingMode :: VideoTrack -> String -> Effect Unit

foreign import subscribeVideo :: (VideoTrack -> Effect Unit) -> Effect (Effect Unit)

foreign import subscribeAudio :: (AudioTrack -> Effect Unit) -> Effect (Effect Unit)
