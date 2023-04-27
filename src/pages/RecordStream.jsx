import { useEffect, useRef, useState } from "react";

// huddle01
import { useEventListener } from "@huddle01/react";
import { Video, Audio } from "@huddle01/react/components";
import {
  useVideo,
  useLobby,
  useRoom,
  useRecording,
  usePeers,
  useMeetingMachine,
} from "@huddle01/react/hooks";

import { createRoomAPI } from "../utils/huddle";

import Button from "../components/Button";

const RecordStream = () => {
  // roomId logic
  const [roomId, setRoomId] = useState("");

  // refs
  const videoRef = useRef(null);

  // huddle01
  const { state } = useMeetingMachine();
  const { stream: camStream, fetchVideoStream, produceVideo } = useVideo();
  const { joinLobby, isLobbyJoined } = useLobby();
  const { joinRoom } = useRoom();
  const {
    startRecording,
    stopRecording,
    error,
    data: recordingData,
    inProgress,
  } = useRecording();
  const { peers } = usePeers();

  useEffect(() => {
    console.log({ peers });
  }, [peers]);


  // Event Listner
  useEventListener("lobby:cam-on", () => {
    if (camStream && videoRef.current) videoRef.current.srcObject = camStream;
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 min-w-fit mr-4">
          Room ID:&nbsp;
          <code className="font-mono font-bold">{roomId}</code>
        </p>
        <div className="absolute bg-red-400 top-0 left-1/2 -translate-x-1/2">
          {JSON.stringify(state.value)}
        </div>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0">
            
          </div>
        </div>
      </div>

      {/* Me Video */}
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <div className="flex flex-wrap gap-3 items-center justify-center ">
          <div className="h-80 aspect-video bg-zinc-800/50 rounded-2xl relative overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>

          {Object.values(peers)
            .filter((peer) => peer.cam)
            .map((peer) => (
              <div
                key={peer.peerId}
                className="h-80 aspect-video bg-zinc-800/50 rounded-2xl relative overflow-hidden"
              >
                <Video
                  peerId={peer.peerId}
                  track={peer.cam}
                  className="object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  debug
                />
              </div>
            ))}
        </div>
        {Object.values(peers)
          .filter((peer) => peer.mic)
          .map((peer) => (
            <Audio key={peer.peerId} peerId={peer.peerId} track={peer.mic} />
          ))}
      </div>

      {/* Buttons */}
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-5 lg:text-left gap-8">
        <div>
          <Button
            disabled={!joinLobby.isCallable}
            onClick={async () => {
              const newRoomId = await createRoomAPI();
              setRoomId(newRoomId);
            }}
          >
            CREATE Room ID
          </Button>
        </div>
        <div>
          <Button
            disabled={!joinLobby.isCallable}
            onClick={() => joinLobby(roomId)}
          >
            joinLobby()
          </Button>
          <div>isLobbyJoined: {isLobbyJoined.toString()}</div>
        </div>
        <div>
          <Button
            disabled={!fetchVideoStream.isCallable}
            onClick={() => fetchVideoStream()}
          >
            fetchVideoStream()
          </Button>
          <div>isLobbyJoined: {isLobbyJoined.toString()}</div>
        </div>
        <div>
          <Button disabled={!joinRoom.isCallable} onClick={() => joinRoom()}>
            joinRoom()
          </Button>
          <div>isLobbyJoined: {isLobbyJoined.toString()}</div>
        </div>
        <div>
          <Button
            disabled={!produceVideo.isCallable}
            onClick={() => produceVideo(camStream)}
          >
            produceVideo()
          </Button>
          <div>isLobbyJoined: {isLobbyJoined.toString()}</div>
        </div>
        <div>
          <Button
            disabled={!startRecording.isCallable}
            onClick={() => {
              console.log(`https://${window.location.host}/rec/${roomId}`);
              startRecording(`https://${window.location.host}/rec/${roomId}`);
            }}
          >
            startRecording()
          </Button>
          <div>error: {error}</div>
        </div>
        <div>
          <Button disabled={!stopRecording.isCallable} onClick={stopRecording}>
            stopRecording()
          </Button>
          <div>inProgress: {inProgress.toString()}</div>
        </div>
      </div>
      <div className="text-green-300">{(recordingData)?.s3Url}</div>
    </main>
  );
};

export default RecordStream;