module Playback where

import Prelude (Unit)
import Effect (Effect)
import Track (VideoTrack, AudioTrack)

foreign import setPlaybackAudio :: AudioTrack -> Effect Unit
foreign import setPlaybackVideo :: VideoTrack -> Effect Unit
