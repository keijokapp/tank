module Peer where

import Prelude (Unit)
import Effect (Effect)
import Effect.Promise (Promise)
import Track (VideoTrack, AudioTrack)
import PeerConnection (PeerConnection)

type SendCallback = forall b. b -> Effect Unit
type RequestCallback = forall a. a -> SendCallback -> Effect Unit
type MessageCallback = forall a. (a -> Effect Unit)

foreign import data Peer :: Type

foreign import createPeer :: PeerConnection
                          -> (VideoTrack -> Effect Unit)
                          -> (AudioTrack -> Effect Unit)
                          -> ((VideoTrack -> Effect Unit) -> Effect (Effect Unit))
                          -> ((AudioTrack -> Effect Unit) -> Effect (Effect Unit))
                          -> Effect Peer
foreign import setSendVideo :: Peer -> Boolean -> Effect Unit
foreign import setSendAudio :: Peer -> Boolean -> Effect Unit
foreign import sendMessage :: forall a. Peer -> a -> Effect Unit
foreign import subscribeMessage :: Peer -> MessageCallback -> Effect (Effect Unit)
foreign import sendRequest :: forall a b. Peer -> a -> Effect (Promise b)
foreign import subscribeRequest :: forall a. Peer -> (a -> SendCallback -> Effect Unit) -> Effect (Effect Unit)
