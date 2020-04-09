module PendingPeer where

import Prelude
import Data.Maybe (Maybe(Nothing, Just))
import Data.Either (Either(Left, Right))
import Data.Map (Map)
import Data.Map as Map
import Data.FoldableWithIndex (foldWithIndexM)
import Data.Argonaut.Core (Json, toObject, caseJsonNumber)
import Foreign.Object as FO
import Effect (Effect)
import Effect.Console (warn)
import Effect.Ref as Ref
import Effect.Promise (Promise, runPromise)
import Effect.Promise (class Deferred, promise) as Promise
import Effect.Exception (Error)
import Signaling (PeerId, PeerType(Operator, Tank), peerId, subscribePeer, sendSdp, sendIce, subscribeSdp, subscribeIce)
import Peer (RequestCallback, MessageCallback, Peer, createPeer)
import Peer as Peer
import PeerConnection (createPeerConnection)
import Capture (subscribeVideo, subscribeAudio)
import Playback (setPlaybackVideo, setPlaybackAudio)
import Util (timestamp)

type PendingPeerPending = {
  requestSubscribers :: Map Int RequestCallback,
  messageSubscribers :: Map Int MessageCallback,
  sendAudio :: Boolean,
  sendVideo :: Boolean
}

type PendingPeerReady = {
  requestSubscribers :: Map Int (Effect Unit),
  messageSubscribers :: Map Int (Effect Unit),
  peer :: Peer
}

newtype PendingPeer = PendingPeer (Ref.Ref (Either PendingPeerPending PendingPeerReady))

createPendingPeer :: PeerType -> Effect PendingPeer
createPendingPeer peerType = do
  pendingPeer <- Ref.new (Left {
    requestSubscribers: Map.empty,
    messageSubscribers: Map.empty,
    sendAudio: false,
    sendVideo: false
  })
  runPromise (onPeer (PendingPeer pendingPeer)) (const (pure unit)) (waitForPeer peerType)
  pure (PendingPeer pendingPeer)
  where
    onPeer :: PendingPeer -> Peer -> Effect Unit
    onPeer (PendingPeer pendingPeerRef) peer = do
      pendingPeer <- Ref.read pendingPeerRef
      case pendingPeer of
        Left pendingPeer' -> do
          Peer.setSendVideo peer pendingPeer'.sendVideo
          Peer.setSendAudio peer pendingPeer'.sendAudio
          requestSubscribers <- foldWithIndexM (addRequestSubscriber peer) Map.empty pendingPeer'.requestSubscribers
          messageSubscribers <- foldWithIndexM (addMessageSubscriber peer) Map.empty pendingPeer'.messageSubscribers
          Ref.write (Right { peer, requestSubscribers, messageSubscribers }) pendingPeerRef
        Right _ -> mempty
    addRequestSubscriber peer id requestSubscribers requestCallback = do
      unsubscribe <- Peer.subscribeRequest peer requestCallback
      pure (Map.insert id unsubscribe requestSubscribers)
    addMessageSubscriber peer id messageSubscribers messageCallback = do
      unsubscribe <- Peer.subscribeMessage peer messageCallback
      pure (Map.insert id unsubscribe messageSubscribers)

waitForPeer :: PeerType -> (Promise.Deferred => Promise Peer)
waitForPeer localPeerType = Promise.promise callback
  where
    callback :: (Peer -> Effect Unit) -> (Error -> Effect Unit) -> Effect Unit
    callback resolve reject = do
      unsubscribe <- Ref.new $ pure unit
      unsubscribeFn <- subscribePeer localPeerType (peerId localPeerType) (onPeer unsubscribe resolve reject)
      Ref.write unsubscribeFn unsubscribe
    accept :: PeerType -> PeerType -> Boolean
    accept Tank Operator = true
    accept Operator Tank = true
    accept _ _ = false
    onPeer :: Ref.Ref (Effect Unit) -> (Peer -> Effect Unit) -> (Error -> Effect Unit) -> PeerType -> PeerId -> Effect Unit
    onPeer unsubscribe resolve reject remotePeerType remotePeerId =
      when (accept localPeerType remotePeerType) do
        join $ Ref.read unsubscribe
        runPromise resolve reject (initConnection localPeerType (peerId localPeerType) remotePeerId)

initConnection :: PeerType -> PeerId -> PeerId -> (Promise.Deferred => Promise Peer)
initConnection peerType localPeer remotePeer = Promise.promise (callback peerType)
  where
    callback Tank resolve _ = do
      unsubscribe <- Ref.new $ pure unit
      unsubscribeFn <- subscribeSdp remotePeer localPeer \sdp -> do
        join $ Ref.read unsubscribe
        pc <- createPeerConnection
          (Just sdp)
          (sendSdp localPeer remotePeer)
          (sendIce localPeer remotePeer)
          (subscribeSdp remotePeer localPeer)
          (subscribeIce remotePeer localPeer)
        peer <- createPeer
          pc
          setPlaybackVideo
          setPlaybackAudio
          subscribeVideo
          subscribeAudio
        resolve peer
      Ref.write unsubscribeFn unsubscribe
    callback Operator resolve _ = do
      pc <- createPeerConnection
        Nothing
        (sendSdp localPeer remotePeer)
        (sendIce localPeer remotePeer)
        (subscribeSdp remotePeer localPeer)
        (subscribeIce remotePeer localPeer)
      peer <- createPeer
        pc
        (\_ -> warn "Operator should not subscribe to video" >>= pure)
        setPlaybackAudio
        subscribeVideo
        subscribeAudio
      resolve peer

setSendAudio :: PendingPeer -> Boolean -> Effect Unit
setSendAudio (PendingPeer pendingPeerRef) sendAudio = do
  Ref.read pendingPeerRef >>= case _ of
    Left peer' -> Ref.write (Left (peer' { sendAudio = sendAudio })) pendingPeerRef
    Right peer' -> Peer.setSendAudio peer'.peer sendAudio

setSendVideo :: PendingPeer -> Boolean -> Effect Unit
setSendVideo (PendingPeer pendingPeerRef) sendVideo = do
  Ref.read pendingPeerRef >>= case _ of
    Left peer' -> Ref.write (Left (peer' { sendVideo = sendVideo })) pendingPeerRef
    Right peer' -> Peer.setSendVideo peer'.peer sendVideo

sendMessage :: PendingPeer -> Json -> Effect Unit
sendMessage (PendingPeer pendingPeerRef) message =
  Ref.read pendingPeerRef >>= case _ of
    Left _ -> warn "Peer is not available"
    Right { peer } -> Peer.sendMessage peer message

subscribeRequest :: PendingPeer -> (FO.Object Number -> Effect Unit) -> Effect (Effect Unit)
subscribeRequest (PendingPeer pendingPeer) callback = do
  subscriberId <- timestamp
  subscribe subscriberId
  pure (unsubscribe subscriberId)
  where
    requestCallback :: RequestCallback
    requestCallback request respond = do
      case decode request of
        Nothing -> pure unit
        Just request' -> callback request'
    decode json = do
      object <- toObject json
      pure (FO.fold (\a key value -> caseJsonNumber a (\value' -> FO.insert key value' a) value) FO.empty object)
    subscribe subscriberId = do
      peer <- Ref.read pendingPeer
      case peer of
        Left peer' -> do
          Ref.write (Left {
            sendVideo: peer'.sendVideo,
            sendAudio: peer'.sendAudio,
            requestSubscribers: Map.insert subscriberId requestCallback peer'.requestSubscribers,
            messageSubscribers: peer'.messageSubscribers
          }) pendingPeer
        Right peer' -> do
          unsubscribeFn <- Peer.subscribeRequest peer'.peer requestCallback
          Ref.write (Right {
            peer: peer'.peer,
            requestSubscribers: Map.insert subscriberId unsubscribeFn peer'.requestSubscribers,
            messageSubscribers: peer'.messageSubscribers
          }) pendingPeer
    unsubscribe subscriberId = do
      peer <- Ref.read pendingPeer
      case peer of
        Left peer' -> do
          Ref.write (Left {
            sendVideo: peer'.sendVideo,
            sendAudio: peer'.sendAudio,
            requestSubscribers: Map.delete subscriberId peer'.requestSubscribers,
            messageSubscribers: peer'.messageSubscribers
          }) pendingPeer
        Right peer' -> do
          case Map.lookup subscriberId peer'.requestSubscribers of
            Nothing -> mempty
            Just unsubscribeFn -> unsubscribeFn
          Ref.write (Right {
            peer: peer'.peer,
            requestSubscribers: Map.delete subscriberId peer'.requestSubscribers,
            messageSubscribers: peer'.messageSubscribers
          }) pendingPeer


subscribeMessage :: PendingPeer -> (FO.Object Number -> Effect Unit) -> Effect (Effect Unit)
subscribeMessage (PendingPeer pendingPeer) callback = do
  subscriberId <- timestamp
  subscribe subscriberId
  pure (unsubscribe subscriberId)
  where
    messageCallback message = do
      case decode message of
        Nothing -> pure unit
        Just message' -> callback message'
    decode json = do
      object <- toObject json
      pure (FO.fold (\a key value -> caseJsonNumber a (\value' -> FO.insert key value' a) value) FO.empty object)
    subscribe subscriberId = do
      peer <- Ref.read pendingPeer
      case peer of
        Left peer' -> do
          Ref.write (Left {
            sendVideo: peer'.sendVideo,
            sendAudio: peer'.sendAudio,
            requestSubscribers: peer'.requestSubscribers,
            messageSubscribers: Map.insert subscriberId messageCallback peer'.messageSubscribers
          }) pendingPeer
        Right peer' -> do
          unsubscribeFn <- Peer.subscribeMessage peer'.peer messageCallback
          Ref.write (Right {
            peer: peer'.peer,
            requestSubscribers: peer'.requestSubscribers,
            messageSubscribers: Map.insert subscriberId unsubscribeFn peer'.messageSubscribers
          }) pendingPeer
    unsubscribe subscriberId = do
      peer <- Ref.read pendingPeer
      case peer of
        Left peer' -> do
          Ref.write (Left {
            sendVideo: peer'.sendVideo,
            sendAudio: peer'.sendAudio,
            requestSubscribers: peer'.requestSubscribers,
            messageSubscribers: Map.delete subscriberId peer'.messageSubscribers
          }) pendingPeer
        Right peer' -> do
          case Map.lookup subscriberId peer'.messageSubscribers of
            Nothing -> mempty
            Just unsubscribeFn -> unsubscribeFn
          Ref.write (Right {
            peer: peer'.peer,
            requestSubscribers: peer'.requestSubscribers,
            messageSubscribers: Map.delete subscriberId peer'.messageSubscribers
          }) pendingPeer
