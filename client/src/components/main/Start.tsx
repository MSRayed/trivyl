import { Button } from "@/components/ui/button";
import { SocketContext } from "@/app/socketContext";
import { useContext } from "react";

const Start = () => {
  const socket = useContext(SocketContext);

  const startGame = () => {
    if (socket) {
      socket.emit("start-game");
    }
  };

  return (
    <Button className="w-full mt-4" onClick={startGame}>
      Start Game
    </Button>
  );
};

export default Start;
