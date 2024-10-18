import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import RoomManager from "@/app/managers/RoomManager";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

export const roomManager = new RoomManager();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on(
      "join",
      (name: string, code: string, callback: (res: any) => {}) => {
        if (!roomManager.roomExists(code)) {
          roomManager.addRoom(code);

          console.log(`New room created ${code}`);
        }

        const room = roomManager.getRoom(code);
        const player = room.admit(name, socket.id);

        console.log(`Admitted ${name}`);

        callback({
          status: "ok",
          isOwner: player.owner,
          players: room.getAllPlayers(),
        });

        socket.to(code).emit("new-player", player);

        socket.join(code);
      }
    );

    socket.on("disconnect", (_) => {
      const room = roomManager.getRoomOfPlayer(socket.id);

      if (room) {
        const player = room.removePlayer(socket.id);
        socket.to(room?.code).emit("player-disconnected", player);

        console.log(`${player.name} disconnected`);
      }
    });

    socket.on("start-game", () => {
      const room = roomManager.getRoomOfPlayer(socket.id);
      console.log(socket.id);

      if (room) {
        room.startGame();

        console.log(`Room ${room?.code} game started`);
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
