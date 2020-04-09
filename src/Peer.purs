module Peer where

import Prelude (Unit)
import Effect (Effect)
import Effect.Promise (Promise, class Deferred)
import Data.Argonaut.Core (Json)
import Track (VideoTrack, AudioTrack)
import PeerConnection (PeerConnection)

type RequestCallback = Json -> (Json -> Effect Unit) -> Effect Unit
type MessageCallback = Json -> Effect Unit

foreign import data Peer :: Type

foreign import createPeer :: PeerConnection
                          -> (VideoTrack -> Effect Unit)
                          -> (AudioTrack -> Effect Unit)
                          -> ((VideoTrack -> Effect Unit) -> Effect (Effect Unit))
                          -> ((AudioTrack -> Effect Unit) -> Effect (Effect Unit))
                          -> Effect Peer
foreign import setSendVideo :: Peer -> Boolean -> Effect Unit
foreign import setSendAudio :: Peer -> Boolean -> Effect Unit
foreign import sendMessage :: Peer -> Json -> Effect Unit
foreign import subscribeMessage :: Peer -> MessageCallback -> Effect (Effect Unit)
foreign import sendRequestImpl :: Peer -> Json -> Promise Json

sendRequest :: Deferred => Peer -> Json -> Promise Json
sendRequest = sendRequestImpl

foreign import subscribeRequest :: Peer -> RequestCallback -> Effect (Effect Unit)
