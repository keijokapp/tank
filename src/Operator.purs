module Operator where

import Prelude (($), (>>=), Unit, bind, pure, unit, discard, const, unless)
import Control.Monad (join)
import Data.FoldableWithIndex (foldWithIndexM)
import Data.Maybe (Maybe(Nothing, Just))
import Data.Either (Either(Left, Right))
import Data.Map as Map
import Effect (Effect)
import Effect.Exception (Error)
import Effect.Ref as Ref
import Effect.Console (warn)
import Effect.Promise (class Deferred, Promise, runPromise, promise)
import Effect.Timer (setTimeout, clearTimeout)
import Foreign.Object as FO
import Track (VideoTrack)
import PeerConnection (createPeerConnection)
import Peer (RequestCallback, Peer, createPeer)
import Peer as Peer
import Signaling (PeerId, PeerType(Operator, Tank), peerId, subscribePeer, sendSdp, sendIce, subscribeSdp, subscribeIce)
import Playback (setPlaybackVideo, setPlaybackAudio)
import Capture (subscribeAudio)
import Util (nextTick)

newtype PendingPeer = PendingPeer (Ref.Ref (Either { requestSubscribers :: Map.Map Int RequestCallback, sendAudio :: Boolean, subscriberId :: Int } { requestSubscribers :: Map.Map Int (Effect Unit), peer :: Peer }))

main :: Effect Unit
main = do
  peer <- initPendingPeer
  setControl <- initControls (sendMessage peer)
  pure unit

initControls :: (FO.Object Number -> Effect Unit) -> Effect (String -> Maybe Number -> Effect Unit)
initControls sendMessage' = do
  timeoutRef <- Ref.new Nothing
  nextCommandRef <- Ref.new FO.empty
  needsSendRef <- Ref.new false
  pure (setControl timeoutRef nextCommandRef needsSendRef)
  where
    sendControls timeoutRef nextCommandRef = do
      timer <- Ref.read timeoutRef
      case timer of
        Just t -> do
          clearTimeout t
          Ref.write Nothing timeoutRef
        Nothing -> pure unit
      nextCommand <- Ref.read nextCommandRef
      unless (FO.isEmpty nextCommand) do
        sendMessage' nextCommand
        timeoutId <- setTimeout 400 (sendControls timeoutRef nextCommandRef)
        Ref.write (Just timeoutId) timeoutRef
    setControl timeoutRef nextCommandRef needsSendRef control (Just value) = do
      Ref.modify_ (FO.insert control value) nextCommandRef
      needsSend <- Ref.read needsSendRef
      unless needsSend do
        Ref.write true needsSendRef
        nextTick do
          Ref.write false needsSendRef
          sendControls timeoutRef nextCommandRef
    setControl _ nextCommandRef _ control Nothing =
      Ref.modify_ (FO.delete control) nextCommandRef

sendMessage :: PendingPeer -> FO.Object Number -> Effect Unit
sendMessage (PendingPeer pendingPeer) message =
  Ref.read pendingPeer >>= sendMessage'
  where
    sendMessage' (Left _) = warn "Peer is not available"
    sendMessage' (Right { peer }) = Peer.sendMessage peer message

initPendingPeer :: Effect PendingPeer
initPendingPeer = do
  pendingPeer <- Ref.new $ Left {
    requestSubscribers: Map.empty,
    sendAudio: false,
    subscriberId: 0
  }
  runPromise (onPeer (PendingPeer pendingPeer)) (const (pure unit)) (waitForPeer (peerId Operator))
  pure (PendingPeer pendingPeer)
  where
    onPeer :: PendingPeer -> Peer -> Effect Unit
    onPeer (PendingPeer pendingPeerRef) peer = do
      pendingPeer <- Ref.read pendingPeerRef
      (requestSubscribers :: Map.Map Int (Effect Unit)) <- handlePendingPeer peer pendingPeer
      Ref.write (Right { peer, requestSubscribers }) pendingPeerRef
      pure unit
    handlePendingPeer peer (Left pendingPeer) = do
      Peer.setSendAudio peer pendingPeer.sendAudio
      foldWithIndexM (\i a (requestCallback :: RequestCallback) -> addSubscriber peer i a requestCallback) Map.empty pendingPeer.requestSubscribers
    handlePendingPeer peer (Right pendingPeer) = pure (Map.empty) -- error really
    addSubscriber peer id requestSubscribers (requestCallback :: RequestCallback) = do
      unsubscribe <- Peer.subscribeRequest peer requestCallback
      pure (Map.insert id unsubscribe requestSubscribers)

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
