module PeerConnection where

import Prelude (Unit)
import Data.Maybe (Maybe)
import Effect (Effect)
import Track (VideoTrack, AudioTrack)
import Signaling (SDP, ICE)

data TransceiverDirection = SendRecv | SendOnly | RecvOnly | Inactive

data TransceiverOptions = TransceiverOptions {
  direction :: TransceiverDirection
}

data DataChannelOptions = DataChannelOptions {
  ordered :: Boolean,
  maxPacketLifeTime :: Maybe Int,
  maxRetransmits :: Maybe Int,
  protocol :: String,
  negotiated :: Boolean,
  id :: Maybe Int
}

foreign import data PeerConnection :: Type

foreign import data Transceiver :: Type
foreign import data DataChannel :: Type

foreign import createPeerConnection :: Maybe SDP
                                    -> (SDP -> Effect Unit)
                                    -> (ICE -> Effect Unit)
                                    -> ((SDP -> Effect Unit) -> Effect (Effect Unit))
                                    -> ((ICE -> Effect Unit) -> Effect (Effect Unit))
                                    -> Effect PeerConnection
foreign import addVideoTransceiver :: PeerConnection -> Maybe VideoTrack -> TransceiverOptions -> Effect Transceiver
foreign import addAudioTransceiver :: PeerConnection -> Maybe AudioTrack -> TransceiverOptions -> Effect Transceiver
foreign import createDataChannel :: PeerConnection -> String -> DataChannelOptions -> Effect DataChannel
foreign import subscribeVideoTrack :: PeerConnection -> (VideoTrack -> Effect Unit) -> Effect (Effect Unit)
foreign import subscribeAudioTrack :: PeerConnection -> (AudioTrack -> Effect Unit) -> Effect (Effect Unit)
foreign import subscribeClose :: PeerConnection -> Effect Unit -> Effect (Effect Unit)
