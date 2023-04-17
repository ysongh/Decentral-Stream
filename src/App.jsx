import React, { useRef } from "react";

import { useEventListener } from "@huddle01/react";
import { useHuddle01Web } from "@huddle01/react/hooks";

import Button from "./components/Button";
import SendButton from "./components/SendButton";
import Video from "./components/Video";

export default function Home() {
  const videoRef = useRef(null);

  const { state, send } = useHuddle01Web();
  // Event Listner
  useEventListener(state, "JoinedLobby.Cam.On", () => {
    if (state.context.camStream && videoRef.current)
      videoRef.current.srcObject = state.context.camStream;
  });

  console.log({ consumersIndex: state.context });

  return (
    <div className="grid grid-cols-2">
      <div>
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="https://huddle01.com">
            Huddle01 SDK!
          </a>
        </h1>

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
        <h2 className="text-2xl">Peers</h2>
        <div className="break-words">{JSON.stringify(state.context.peers)}</div>
        <h2 className="text-2xl">Error</h2>
        <div className="break-words text-red-500">
          {JSON.stringify(state.context.error)}
        </div>
        {/* <h2 className="text-2xl">Peers</h2>
      <div className="break-words">{JSON.stringify(state.context.peers)}</div>
      <h2 className="text-2xl">Consumers</h2>
      <div className="break-words">
        {JSON.stringify(state.context.consumers)}
      </div> */}

        <h2 className="text-3xl text-blue-500 font-extrabold">Idle</h2>
        <Button disabled={!state.matches("Idle")} onClick={() => send("INIT")}>
          INIT
        </Button>

        <br />
        <br />
        <h2 className="text-3xl text-red-500 font-extrabold">Initialized</h2>
        <Button
          disabled={!state.matches("Initialized")}
          onClick={() => send("JOIN_LOBBY")}
        >
          JOIN_LOBBY
        </Button>
        <br />
        <br />
        <h2 className="text-3xl text-yellow-500 font-extrabold">Lobby</h2>
        <div className="flex gap-4 flex-wrap">
          {/* <Button onClick={() => send(RESTART)}>RESTART</Button> */}
          {/* <Button
          disabled={!state.matches('JoinedLobby')}
          onClick={() => send('ENABLE_CAM')}
        >
          ENABLE_CAM
        </Button> */}
          <SendButton
            disabled={!state.matches("JoinedLobby")}
            event="ENABLE_CAM"
          />
          <SendButton
            disabled={!state.matches("JoinedLobby")}
            event={"ENABLE_MIC"}
          />
          <SendButton
            disabled={!state.matches("JoinedLobby")}
            event={"JOIN_ROOM"}
          />

          <Button
            disabled={!state.matches("JoinedLobby")}
            onClick={() => send("LEAVE_LOBBY")}
          >
            LEAVE_LOBBY
          </Button>
          <SendButton
            disabled={!state.matches("JoinedLobby")}
            event={"DISABLE_CAM"}
          />
          <SendButton
            disabled={!state.matches("JoinedLobby")}
            event={"DISABLE_MIC"}
          />
        </div>
        <br />
        <h2 className="text-3xl text-green-600 font-extrabold">Room</h2>
        <div className="flex gap-4 flex-wrap">
          <SendButton
            disabled={!state.matches("JoinedRoom")}
            event={"PRODUCE_MIC"}
          />

          <SendButton
            disabled={!state.matches("JoinedRoom")}
            event={"PRODUCE_CAM"}
          />

          <SendButton
            disabled={!state.matches("JoinedRoom")}
            event={"STOP_PRODUCING_MIC"}
          />

          <SendButton
            disabled={!state.matches("JoinedRoom")}
            event={"STOP_PRODUCING_CAM"}
          />

          <SendButton
            disabled={!state.matches("JoinedRoom")}
            event={"LEAVE_ROOM"}
          />

          <Button
            disabled={!state.matches("JoinedRoom")}
            onClick={() =>
              send({ type: "START_RECORDING", sourceUrl: "localhost" })
            }
          >
            START_RECORDING
          </Button>
          <Button
            disabled={!state.matches("JoinedRoom")}
            onClick={() =>
              send({
                type: "START_STREAMING",
                streamingData: { sourceUrl: "localhost" },
              })
            }
          >
            START_STREAMING
          </Button>
        </div>

        {/* Uncomment to see the Xstate Inspector */}
        {/* <Inspect /> */}
      </div>
      <div>
        Me Video:
        <video ref={videoRef} autoPlay muted></video>
        <div className="grid grid-cols-4">
          {Object.keys(state.context.consumers)
            .filter(
              (consumerId) =>
                state.context.consumers[consumerId] &&
                state.context.consumers[consumerId].track?.kind === "video"
            )
            .map((consumerId) => (
              <Video
                key={consumerId}
                peerId={state.context.consumers[consumerId].peerId}
                track={state.context.consumers[consumerId].track}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
