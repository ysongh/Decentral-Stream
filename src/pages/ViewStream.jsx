import { useParams } from "react-router-dom";
import { useHuddle01 } from '@huddle01/react';
import { useLobby, useAudio, useVideo, useRoom, usePeers } from '@huddle01/react/hooks';

import { Audio, Video } from "@huddle01/react/components";

export default function ViewStream() {
  const { roomId } = useParams();

  const { initialize, isInitialized } = useHuddle01();
  const { joinLobby } = useLobby();
  const { 
    fetchAudioStream, stopAudioStream, error: micError, 
    produceAudio, stopProducingAudio 
  } = useAudio();

  const { 
    fetchVideoStream, stopVideoStream, error: camError, 
    produceVideo, stopProducingVideo 
  } = useVideo(); 
  const { joinRoom, leaveRoom } = useRoom();

  const { peers } = usePeers();

  console.log(peers)

  return (
    <div>{isInitialized ? 'Hello World!' : 'Please initialize'}

      <div className="grid grid-cols-4">
        {Object.values(peers)
          .filter((peer) => peer.cam)
          .map((peer) => (
            <Video
              key={peer.peerId}
              peerId={peer.peerId}
              track={peer.cam}
              debug
            />
          ))}

        {Object.values(peers)
          .filter((peer) => peer.mic)
          .map((peer) => (
            <Audio key={peer.peerId} peerId={peer.peerId} track={peer.mic} />
          ))}
      </div>

      <button 
        onClick={() => joinLobby(roomId)}
      >
        Join Lobby
      </button>

      {/* Mic */} 
      <button disabled={!fetchAudioStream.isCallable} onClick={fetchAudioStream}>
        FETCH_AUDIO_STREAM
      </button>

      {/* Webcam */} 
      <button disabled={!fetchVideoStream.isCallable} onClick={fetchVideoStream}>
        FETCH_VIDEO_STREAM
      </button>

      <button disabled={!joinRoom.isCallable} onClick={joinRoom}>
        JOIN_ROOM 
      </button>

      <button disabled={!leaveRoom.isCallable} onClick={leaveRoom}>
        LEAVE_ROOM 
      </button>

      <button disabled={!produceVideo.isCallable} onClick={() => produceVideo(camStream)}>
        Produce Cam  
      </button>

      <button disabled={!produceAudio.isCallable} onClick={() => produceAudio(micStream)}>
        Produce Mic  
      </button>

      <button disabled={!stopProducingVideo.isCallable} onClick={stopProducingVideo}>
        Stop Producing Cam  
      </button>

      <button disabled={!stopProducingAudio.isCallable} onClick={stopProducingAudio}>
        Stop Producing Mic  
      </button>

    </div>
  );
};
