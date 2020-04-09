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
foreign import subscribeSdp :: PeerId
                            -> PeerId
                            -> (SDP -> Effect Unit)
                            -> Effect (Effect Unit)
foreign import subscribeIce ::  PeerId
                            -> PeerId
                            -> (ICE -> Effect Unit)
                            -> Effect (Effect Unit)
foreign import subscribePeerImpl :: PeerType
                                 -> PeerType
                                 -> PeerType
                                 -> PeerId
                                 -> (PeerType -> PeerId -> Effect Unit)
                                 -> Effect (Effect Unit)
foreign import peerId :: PeerType -> PeerId

subscribePeer :: PeerType -> PeerId -> (PeerType -> PeerId -> Effect Unit) -> Effect (Effect Unit)
subscribePeer = subscribePeerImpl Operator Tank
