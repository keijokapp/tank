module Signaling (
  PeerType(Operator, Tank),
  PeerId,
  SDP,
  ICE,
  peerId,
  sendSdp,
  sendIce,
  subscribeSdp,
  subscribeIce,
  subscribePeer
) where

import Prelude (Unit)
import Effect (Effect)

data PeerType = Tank | Operator
newtype PeerId = PeerId String

foreign import data ICE :: Type
foreign import data SDP :: Type

foreign import sendSdp :: PeerId -> PeerId -> SDP -> Effect Unit
foreign import sendIce :: PeerId -> PeerId -> ICE -> Effect Unit
foreign import subscribeSdpImpl :: (String -> PeerId)
                                -> PeerId
                                -> PeerId
                                -> (SDP -> Effect Unit)
                                -> Effect (Effect Unit)
foreign import subscribeIceImpl :: (String -> PeerId)
                                -> PeerId
                                -> PeerId
                                -> (ICE -> Effect Unit)
                                -> Effect (Effect Unit)
foreign import subscribePeerImpl :: PeerType
                                 -> PeerType
                                 -> (String -> PeerId)
                                 -> PeerType
                                 -> PeerId
                                 -> (PeerType -> PeerId -> Effect Unit)
                                 -> Effect (Effect Unit)
foreign import peerIdImpl :: (String -> PeerId) -> PeerType -> PeerId

subscribeSdp :: PeerId -> PeerId -> (SDP -> Effect Unit) -> Effect (Effect Unit)
subscribeSdp = subscribeSdpImpl PeerId

subscribeIce :: PeerId -> PeerId -> (ICE -> Effect Unit) -> Effect (Effect Unit)
subscribeIce = subscribeIceImpl PeerId

subscribePeer :: PeerType -> PeerId -> (PeerType -> PeerId -> Effect Unit) -> Effect (Effect Unit)
subscribePeer = subscribePeerImpl Operator Tank PeerId

peerId :: PeerType -> PeerId
peerId = peerIdImpl PeerId
