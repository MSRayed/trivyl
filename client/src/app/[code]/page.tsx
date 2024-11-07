"use client";

import Rules from "@/components/main/Rules";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "next-client-cookies";
import NameForm from "@/components/NameForm";
import Lobby from "@/components/main/Lobby";
import QuestionBoard from "@/components/main/QuestionBoard";
import Start from "@/components/main/Start";
import { SocketContext } from "@/app/socketContext";
import AnswerInput from "@/components/main/AnswerInput";
import { io, Socket } from "socket.io-client";
import MessageLog from "@/components/main/MessageLog";
import { States } from "@/lib/utils";

const MainPage = () => {
  const [hasName, setHasName] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [state, setState] = useState<States>(States.LOBBY);

  const socketRef = useRef<Socket>();

  const cookies = useCookies();

  useEffect(() => {
    setHasName(!!cookies.get("name"));

    socketRef.current = io();

    return () => {
      if (!socketRef.current) {
        console.log("Socket not defined");
        return;
      }

      socketRef.current.close();

      console.log("Disconnected!");
    };
  }, [cookies]);

  if (!hasName) {
    return (
      <div className="h-full flex justify-center items-center">
        <NameForm submitText="Join" />
      </div>
    );
  }

  return (
    <SocketContext.Provider value={socketRef.current || io()}>
      <div className="h-full">
        <Rules owner={isOwner} />

        <div className="flex justify-center p-2 m-auto">
          <div className="grid grid-cols-[auto,1fr,auto] space-x-4">
            <div>
              <Lobby setHasName={setHasName} setIsOwner={setIsOwner} />
            </div>

            <div>
              <QuestionBoard state={state} setState={setState} />
            </div>

            <div>
              <MessageLog />
            </div>

            {isOwner && state == States.LOBBY && (
              <div className="col-start-2 col-end-2 flex justify-center">
                <Start />
              </div>
            )}
            {state == States.QUESTION && (
              <div className="col-start-2 col-end-2">
                <AnswerInput />
              </div>
            )}
          </div>
        </div>
      </div>
    </SocketContext.Provider>
  );
};

export default MainPage;
