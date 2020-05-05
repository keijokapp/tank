module PeerConnection where

import Prelude (Unit)
import Data.Maybe (Maybe)
import Effect (Effect)
import Track (VideoTrack, AudioTrack)
import Signaling (SDP, ICE)

data TransceiverDirection = SendRecv | SendOnly | RecvOnly | Inactive

data TransceiverOptions = TransceiverOptions { direction :: TransceiverOptions }

data DataChannelOptions = DataChannelOptions {
  ordered :: Boolean,
  maxPacketLifeTime :: Maybe Int,
  maxRetransmits :: Maybe Int,
  protocol :: String,
  negotiated :: Boolean,
  id :: Maybe Int
}

data PeerConnection = PeerConnection {
  addVideoTransceiver :: Maybe VideoTrack -> TransceiverOptions -> Effect Transceiver,
  addAudioTransceiver :: Maybe AudioTrack -> TransceiverOptions -> Effect Transceiver,
  createDataChannel :: String -> DataChannelOptions -> Effect DataChannel,
  subscribeVideoTrack :: (VideoTrack -> Effect Unit) -> Effect (Effect Unit),
  subscribeAudioTrack :: (AudioTrack -> Effect Unit) -> Effect (Effect Unit)
}

foreign import data Transceiver :: Type
foreign import data DataChannel :: Type

foreign import createPeerConnection :: SDP
                                    -> (SDP -> Effect Unit)
                                    -> (ICE -> Effect Unit)
                                    -> ((SDP -> Effect Unit) -> Effect (Effect Unit))
                                    -> ((ICE -> Effect Unit) -> Effect (Effect Unit))
                                    -> PeerConnection
