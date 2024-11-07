import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import RoomManager from "@/managers/RoomManager";
import { Question } from "@/managers/QuestionBank";
import { wordMatchPercentage } from "@/lib/utils";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = Number(process.env.PORT) || 4000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const answerShowTime = 5;
const maxScorePerTurn = 20;

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

        if (room.playerExists(socket.id)) {
          console.log(`Already connected ${name}`);

          return;
        }

        const player = room.admit(name, socket.id);

        console.log(`Admitted ${name}`);

        callback({
          status: "ok",
          isOwner: player.owner,
          players: room.getAllPlayers(),
        });

        socket.to(code).emit("new-player", player);
        socket.join(code);

        io.in(code).emit("message", {
          text: `${player.name} joined the room`,
          type: "join",
        });
      }
    );

    socket.on("disconnect", (_) => {
      const room = roomManager.getRoomOfPlayer(socket.id);

      if (!room) {
        console.log("Couldn't find room of player");
        return;
      }

      const player = room.removePlayer(socket.id);
      socket
        .to(room?.code)
        .emit("player-disconnected", player, room.getOwner().id);

      io.in(room.code).emit("message", {
        text: `${player.name} left the room`,
        type: "leave",
      });

      console.log(`${player.name} disconnected`);

      // Delete room if empty
      if (room.isEmpty()) {
        roomManager.deleteRoom(room.code);

        console.log(`Deleted room ${room.code}`);
      }
    });

    socket.on("guess", (guess: string, callback: (res: any) => {}) => {
      const room = roomManager.getRoomOfPlayer(socket.id);

      if (!room) {
        console.log("Couldn't find room");
        return;
      }

      const currQuestion = room?.getCurrentQuestion();

      if (!currQuestion) {
        console.log("Couldn't find question");
        return;
      }

      const player = room.getPlayer(socket.id);

      console.log(`${player.name} made a guess`);

      if (
        wordMatchPercentage(guess, currQuestion.answer, 50) &&
        !player.guessed
      ) {
        // Calculate score
        const score = Math.ceil(
          ((room.timer - answerShowTime) / room.answerTime) * maxScorePerTurn
        );
        player.addScore(score);

        player.setGuessed();

        callback({
          correct: true,
        });

        io.in(room.code).emit("update-score", {
          id: player.id,
          newScore: player.score,
        });
        io.in(room.code).emit("message", {
          text: `${player.name} got the answer`,
          type: "guess",
        });
      } else {
        callback({
          correct: false,
        });
      }
    });

    socket.on("start-game", () => {
      const room = roomManager.getRoomOfPlayer(socket.id);

      if (!room) {
        console.log("Couldn't find room");
        return;
      }

      const player = room?.getPlayer(socket.id);

      if (!player.owner) {
        console.log("Player cannot start the game");
        return;
      }

      const startGame = () => {
        const question = room?.getQuestion() as Question;
        // console.log(question.answer);

        if (!question) {
          console.log("Quiz ended");

          const ranking = room.getRanking();

          io.in(room?.code).emit("results", ranking);

          return;
        }

        io.in(room?.code).emit("new-question", {
          query: question.query,
          id: question.id,
        });

        room.setTimer(room.answerTime + answerShowTime);
        room.ready();

        const intervalId = setInterval(() => {
          room.decTimer();

          io.in(room?.code).emit("tick", room.timer - answerShowTime);

          // If everyone in the room guessed the right show the answer and stop the timer
          if (room.timer == answerShowTime || room.allGuessed()) {
            io.in(room?.code).emit("answer", question.answer);

            // In case of finishing early
            room.ready();
            room.setTimer(answerShowTime - 1);
          }

          // Reset the timer
          if (room.timer == 0) {
            room.setTimer(room.answerTime + answerShowTime);
            clearInterval(intervalId);

            startGame();
          }
        }, 1000);
      };

      if (room) {
        room.initQuestions();

        startGame();

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
