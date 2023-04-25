import React, { useRef, useState } from "react";

import { useEventListener, useHuddle01 } from "@huddle01/react";
import { Audio, Video } from "@huddle01/react/components";
/* Uncomment to see the Xstate Inspector */
// import { Inspect } from '@huddle01/react/components';

import {
  useAudio,
  useLobby,
  useMeetingMachine,
  usePeers,
  useRoom,
  useVideo,
} from "@huddle01/react/hooks";

import Button from "../components/Button";
import { createRoomAPI, getMeetingDetailAPI } from "../utils/huddle";
import { HUDDLE01_PROJECTID } from "../keys";

export default function VideoStream() {

  const [roomId, setRoomId] = useState("");

  // refs
  const videoRef = useRef(null);

  const { state, send } = useMeetingMachine();

  // Event Listner
  useEventListener("lobby:cam-on", () => {
    if (state.context.camStream && videoRef.current)
      videoRef.current.srcObject = state.context.camStream;
  });

  const { initialize } = useHuddle01();
  const { joinLobby } = useLobby();
  const {
    fetchAudioStream,
    produceAudio,
    stopAudioStream,
    stopProducingAudio,
    stream: micStream,
  } = useAudio();
  const {
    fetchVideoStream,
    produceVideo,
    stopVideoStream,
    stopProducingVideo,
    stream: camStream,
  } = useVideo();
  const { joinRoom, leaveRoom } = useRoom();

  const { peers } = usePeers();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-6xl font-bold">
        Welcome to{" "}
        <p className="text-blue-600">
          Decentral Stream
        </p>
      </h1>

      <div className="grid grid-cols-2">
        <div>
          <h2 className="text-2xl">Room State</h2>
          <h3>{JSON.stringify(state.value)}</h3>

          <h2 className="text-2xl">Me Id</h2>
          <div className="break-words">
            {JSON.stringify(state.context.peerId)}
          </div>
          <h2 className="text-2xl">Consumers</h2>
          <div className="break-words">
            {JSON.stringify(state.context.consumers)}
          </div>

          <h2 className="text-2xl">Error</h2>
          <div className="break-words text-red-500">
            {JSON.stringify(state.context.error)}
          </div>
          <h2 className="text-2xl">Peers</h2>
          <div className="break-words">{JSON.stringify(peers)}</div>
          <h2 className="text-2xl">Consumers</h2>
          <div className="break-words">
            {JSON.stringify(state.context.consumers)}
          </div>
          <h2 className="text-2xl">Room ID</h2>
          <div className="break-words">
            {roomId}
          </div>

          <h2 className="text-3xl text-blue-500 font-extrabold">Idle</h2>
          <Button
            disabled={!state.matches("Idle")}
            onClick={() => {
              initialize(HUDDLE01_PROJECTID);
            }}
          >
            INIT
          </Button>

          <br />
          <br />
          <h2 className="text-3xl text-red-500 font-extrabold">Initialized</h2>
          <input
            type="text"
            placeholder="Your Room Id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none mr-2"
          />
          <Button
            disabled={!joinLobby.isCallable}
            onClick={() => {
              joinLobby(roomId);
            }}
          >
            JOIN_LOBBY
          </Button>
          <br />
          <br />
          <Button
            disabled={!joinLobby.isCallable}
            onClick={async () => {
              const newRoomId = await createRoomAPI();
              setRoomId(newRoomId);
              joinLobby(newRoomId);
            }}
          >
            CREATE_LOBBY
          </Button>
          <br />
          <br />
          <h2 className="text-3xl text-yellow-500 font-extrabold">Lobby</h2>
          <div className="flex gap-4 flex-wrap">
            <Button
              disabled={!fetchVideoStream.isCallable}
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/#/stream/${roomId}`)}
            >
              COPY LOBBY LINK
            </Button>

            <Button
              disabled={!fetchVideoStream.isCallable}
              onClick={() => getMeetingDetailAPI(roomId)}
            >
              GET MEETING DETAILS
            </Button>


            <Button
              disabled={!fetchVideoStream.isCallable}
              onClick={fetchVideoStream}
            >
              FETCH_VIDEO_STREAM
            </Button>

            <Button
              disabled={!fetchAudioStream.isCallable}
              onClick={fetchAudioStream}
            >
              FETCH_AUDIO_STREAM
            </Button>

            <Button disabled={!joinRoom.isCallable} onClick={joinRoom}>
              JOIN_ROOM
            </Button>

            <Button
              disabled={!state.matches("Initialized.JoinedLobby")}
              onClick={() => send("LEAVE_LOBBY")}
            >
              LEAVE_LOBBY
            </Button>

            <Button
              disabled={!stopVideoStream.isCallable}
              onClick={stopVideoStream}
            >
              STOP_VIDEO_STREAM
            </Button>
            <Button
              disabled={!stopAudioStream.isCallable}
              onClick={stopAudioStream}
            >
              STOP_AUDIO_STREAM
            </Button>
          </div>
          <br />
          <h2 className="text-3xl text-green-600 font-extrabold">Room</h2>
          <div className="flex gap-4 flex-wrap">
            <Button
              disabled={!produceAudio.isCallable}
              onClick={() => produceAudio(micStream)}
            >
              PRODUCE_MIC
            </Button>

            <Button
              disabled={!produceVideo.isCallable}
              onClick={() => produceVideo(camStream)}
            >
              PRODUCE_CAM
            </Button>

            <Button
              disabled={!stopProducingAudio.isCallable}
              onClick={() => stopProducingAudio()}
            >
              STOP_PRODUCING_MIC
            </Button>

            <Button
              disabled={!stopProducingVideo.isCallable}
              onClick={() => stopProducingVideo()}
            >
              STOP_PRODUCING_CAM
            </Button>

            <Button disabled={!leaveRoom.isCallable} onClick={leaveRoom}>
              LEAVE_ROOM
            </Button>
          </div>

          {/* Uncomment to see the Xstate Inspector */}
          {/* <Inspect /> */}
        </div>
        <div>
          Me Video:
          <video ref={videoRef} autoPlay muted></video>
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
        </div>
      </div>
    </div>
  );
}