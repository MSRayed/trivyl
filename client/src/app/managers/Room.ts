import Player from "@/app/managers/player";
import QuestionManager from "@/app/managers/QuestionManager";

class Room {
  public code: string;
  public players: { [id: string]: Player };
  public questionManager: QuestionManager;

  constructor(code: string) {
    this.code = code;
    this.players = {};
    this.questionManager = new QuestionManager();
  }

  startGame() {
    this.questionManager.initQuestions();
  }

  playerReady(id: string, ready: boolean) {
    this.getPlayer(id).setReady(ready);
  }

  allReady() {
    const notReady = Object.keys(this.players).filter(
      (k) => !this.players[k].ready
    );
    return notReady.length == 0;
  }

  getQuestion() {
    return this.questionManager.getQueuedQuestion();
  }

  admit(name: string, id: string) {
    const isOwner = Object.keys(this.players).length === 0;
    const player = new Player(name, id, isOwner);

    this.players[id] = player;

    return player;
  }

  getAllPlayers() {
    return Object.values(this.players);
  }

  getPlayer(id: string) {
    return this.players[id];
  }

  playerExists(id: string) {
    return this.players.hasOwnProperty(id);
  }

  removePlayer(id: string) {
    const player = this.getPlayer(id);

    delete this.players[id];
    return player;
  }
}

export default Room;
