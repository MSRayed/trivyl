import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/app/socketContext";

interface ScoreProps {
  score: number;
}

const Score = ({ score }: ScoreProps) => {
  return (
    <div className="rounded-[50%] bg-primary px-2">
      <p>{score}</p>
    </div>
  );
};

export default Score;
