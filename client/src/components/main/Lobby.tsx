import { SocketContext } from "@/app/socketContext";
import { UserRound, Crown } from "lucide-react";
import { useCookies } from "next-client-cookies";
import { useParams } from "next/navigation";
import Score from "@/components/main/Score";
import Player from "@/managers/player";
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

interface PlayerRecord {
  [id: string]: {
    name: string;
    score: number;
    owner: boolean;
  };
}

const Lobby = ({ setHasName, setIsOwner }: LobbyProps) => {
  const [players, setPlayers] = useState<PlayerRecord>({});
  const socket = useContext(SocketContext);
  const params = useParams<{ code: string }>();
  const cookies = useCookies();

  useEffect(() => {
    if (cookies.get("name")) {
      const name = cookies.get("name");

      socket.emit("join", name, params.code, (response: any) => {
        setHasName(true);
        setIsOwner(response.isOwner);

        setPlayers(
          response.players.reduce(
            (acc: { [id: string]: Player }, player: Player) => {
              acc[player.id] = player;
              return acc;
            },
            {}
          )
        );
      });
    }

    socket.on("new-player", (player: Player) => {
      setPlayers((prevPlayers) => ({
        ...prevPlayers,
        [player.id]: {
          name: player.name,
          score: player.score,
          owner: player.owner,
        },
      }));

      console.log(`${player.name} joined`);
    });

    socket.on("player-disconnected", (player: Player, ownerId: string) => {
      setPlayers((prevPlayers) => {
        const { [player.id]: _, ...newPlayers } = prevPlayers;

        // Check if the ownerId exists in the remaining players, and if so, set its owner property to true
        if (newPlayers[ownerId]) {
          newPlayers[ownerId] = {
            ...newPlayers[ownerId],
            owner: true,
          };
        }

        return newPlayers;
      });

      if (socket.id == ownerId) {
        setIsOwner(true);
      }

      console.log(`${player.name} disconnected`);
    });

    socket.on(
      "update-score",
      ({ id, newScore }: { id: string; newScore: number }) => {
        setPlayers((prevPlayers) => ({
          ...prevPlayers,
          [id]: { ...prevPlayers[id], score: newScore },
        }));
      }
    );

    return () => {
      socket.off("join");
      socket.off("new-player");
      socket.off("player-disconnected");
      socket.off("update-score");
    };
  }, []);

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
              key={ind}
              className="border-b-2 border-white flex items-center justify-between"
            >
              <div
                className="
                flex
                py-2
              "
              >
                <UserRound className="text-primary" />
                <p className="px-4">{players[id].name}</p>
                <Score score={players[id].score} />
              </div>

              {players[id].owner && <Crown className="text-foreground" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Lobby;
