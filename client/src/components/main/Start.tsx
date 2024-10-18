import { Button } from "@/components/ui/button";
import { useSocket } from "@/app/socket";

const Start = () => {
  // const socket = useSocket();

  const startGame = () => {
    // if (socket) {
    //   socket.emit("start-game");
    // }
  };

  return (
    <Button className="w-full mt-4" onClick={startGame}>
      Start Game
    </Button>
  );
};

export default Start;
