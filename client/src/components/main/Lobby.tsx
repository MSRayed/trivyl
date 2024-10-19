import Player from "@/app/managers/player";
import { SocketContext } from "@/app/socket";
import { UserRound } from "lucide-react";
import { useCookies } from "next-client-cookies";
import { useParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface LobbyProps {
  setHasName: Dispatch<SetStateAction<boolean>>;
  setIsOwner: Dispatch<SetStateAction<boolean>>;
}

const Lobby = ({ setHasName, setIsOwner }: LobbyProps) => {
  const [players, setPlayers] = useState<{ [id: string]: Player }>({});
  const socket = useContext(SocketContext);
  const params = useParams<{ code: string }>();
  const cookies = useCookies();

  useEffect(() => {
    if (socket) {
      if (cookies.get("name")) {
        const name = cookies.get("name");

        socket.emit("join", name, params.code, (response: any) => {
          setHasName(true);
          setIsOwner(response.isOwner);
          setPlayers(response.players);
        });
      }

      socket.on("new-player", (player: Player) => {
        setPlayers((prevPlayers) => ({
          ...prevPlayers,
          [player.id]: player,
        }));

        console.log(`${player.name} joined`);
      });

      socket.on("player-disconnected", (player: Player) => {
        setPlayers((prevPlayers) => {
          const { [player.id]: _, ...newPlayers } = prevPlayers;
          return newPlayers;
        });

        console.log(`${player.name} disconnected`);
      });
    }

    return () => {
      // socket?.disconnect();
    };
  }, [socket]);

  return (
    <div>
      <ul
        className="
        bg-secondary 
        text-foreground 
        w-64 
        rounded-lg 
        space-y-4
        p-4"
      >
        {Object.keys(players).map((id, ind) => {
          return (
            <li
              className="
                border-b-2
                border-white
                flex
                py-2
              "
              key={ind}
            >
              <UserRound className="text-primary" />
              <p className="px-4">{players[id].name}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Lobby;
