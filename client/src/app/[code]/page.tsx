"use client";

import Rules from "@/components/main/Rules";
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import NameForm from "@/components/NameForm";
import Lobby from "@/components/main/Lobby";
import QuestionBoard from "@/components/main/QuestionBoard";
import Start from "@/components/main/Start";

const MainPage = () => {
  const [hasName, setHasName] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);

  const cookies = useCookies();

  useEffect(() => {
    setHasName(!!cookies.get("name"));
  });

  if (!hasName) {
    return (
      <div className="h-full flex justify-center items-center">
        <NameForm submitText="Join" />
      </div>
    );
  }

  return (
    <div className="h-full">
      {isOwner && <Rules />}

      <div className="flex justify-center p-10 m-auto">
        <div className="grid grid-cols-[auto,1fr] space-x-4">
          <div>
            <Lobby setHasName={setHasName} setIsOwner={setIsOwner} />
          </div>

          <div>
            <QuestionBoard started={gameStarted} />
          </div>

          {isOwner && !gameStarted && (
            <div className="col-start-2 col-end-4 flex justify-center">
              <Start />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
