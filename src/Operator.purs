module Operator where

import Prelude (($), Unit, bind, pure, unit, discard, const)
import Control.Monad (join)
import Data.Foldable (foldM)
import Data.Maybe (Maybe(Nothing))
import Data.Tuple (Tuple(Tuple))
import Data.Map as Map
import Effect (Effect)
import Effect.Exception (Error)
import Effect.Ref as Ref
import Effect.Console (warn)
import Effect.Promise (class Deferred, Promise, runPromise, promise)
import Track (VideoTrack)
import PeerConnection (createPeerConnection)
import Peer (SendCallback, RequestCallback, Peer, createPeer, setSendAudio, subscribeRequest)
import Signaling (PeerId, PeerType(Operator, Tank), peerId, subscribePeer, sendSdp, sendIce, subscribeSdp, subscribeIce)
import Playback (setPlaybackVideo, setPlaybackAudio)
import Capture (subscribeAudio)

type PendingPeer = {
  peer :: Maybe Peer,
  requestSubscribers :: Map.Map Int (Tuple (forall a. a -> SendCallback -> Effect Unit) (Ref.Ref (Effect Unit))),
  sendAudio :: Boolean,
  subscriberId :: Int
}

main :: Effect Unit
main = do
  pendingPeer <- Ref.new $ {
    peer: Nothing,
    requestSubscribers: Map.empty,
    sendAudio: false,
    subscriberId: 0
  }
  runPromise (onPeer pendingPeer) (const (pure unit)) do
    peer <- waitForPeer (peerId Operator)
    pure peer
  where
    onPeer :: (Ref.Ref PendingPeer) -> Peer -> Effect Unit
    onPeer pendingPeerRef peer = do
      pendingPeer <- Ref.read pendingPeerRef
      setSendAudio peer (pendingPeer.sendAudio)
      foldM (\a b -> addSubscriber peer b) unit pendingPeer.requestSubscribers
    addSubscriber :: Peer -> Tuple (forall a. a -> SendCallback -> Effect Unit) (Ref.Ref (Effect Unit)) -> Effect Unit
    addSubscriber peer (Tuple requestCallback unsubscribeRef) = do
      _ <- subscribeRequest peer requestCallback
      pure unit
    callback :: RequestCallback
    callback request respond = pure unit
--      Ref.write unsubscribe unsubscribeRef

waitForPeer :: PeerId -> (Deferred => Promise Peer)
waitForPeer localPeer = promise callback
  where
    callback :: (Peer -> Effect Unit) -> (Error -> Effect Unit) -> Effect Unit
    callback resolve _ = do
      unsubscribe <- Ref.new $ pure unit
      unsubscribeFn <- subscribePeer Operator localPeer (onPeer unsubscribe resolve)
      Ref.write unsubscribeFn unsubscribe
    onPeer :: Ref.Ref (Effect Unit) -> (Peer -> Effect Unit) -> PeerType -> PeerId -> Effect Unit
    onPeer unsubscribe resolve Tank remotePeer = do
      join $ Ref.read unsubscribe
      peer <- initConnection localPeer remotePeer
      resolve peer
    onPeer _ _ Operator _ = pure unit

initConnection :: PeerId -> PeerId -> Effect Peer
initConnection localPeer remotePeer = do
  pc <- createPeerConnection
    Nothing
    (sendSdp localPeer remotePeer)
    (sendIce localPeer remotePeer)
    (subscribeSdp remotePeer localPeer)
    (subscribeIce remotePeer localPeer)
  createPeer
    pc
    setPlaybackVideo
    setPlaybackAudio
    subscribeVideo
    subscribeAudio
  where
    subscribeVideo :: (VideoTrack -> Effect Unit) -> Effect (Effect Unit)
    subscribeVideo subscriber = do
      warn "Operator should not subscribe to video"
      pure $ pure unit
