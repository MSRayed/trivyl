import Player from "@/managers/player";
import QuestionManager from "@/managers/QuestionManager";
import { Rules } from "../../server";

class Room {
  public code: string;
  public players: { [id: string]: Player };
  public questionManager: QuestionManager;
  public timer = 0;
  public answerTime = 0;
  public questionsNum = 0;

  constructor(code: string, rules: Rules) {
    this.code = code;
    this.players = {};
    this.questionManager = new QuestionManager();
    this.answerTime = rules.answerTime;
    this.questionsNum = rules.numberOfQuestions;
  }

  initQuestions() {
    this.questionManager.initQuestions(this.questionsNum);
  }

  updateRules(rules: Rules) {
    this.questionsNum = rules.numberOfQuestions;
    this.answerTime = rules.answerTime;
  }

  decTimer() {
    this.timer--;
  }

  setTimer(time: number) {
    this.timer = time;
  }

  getQuestion() {
    return this.questionManager.getQueuedQuestion();
  }

  getCurrentQuestion() {
    return this.questionManager.getCurrentQuestion();
  }

  allGuessed() {
    let all = true;

    for (let key of Object.keys(this.players)) {
      if (!this.players[key].guessed) {
        all = false;
        break;
      }
    }

    return all;
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

  getOwner() {
    return this.players[Object.keys(this.players)[0]];
  }

  getRanking() {
    let ids = Object.keys(this.players);

    ids.sort((a, b) => {
      return this.players[b].score - this.players[a].score;
    });

    const ranking = ids.map((id) => this.getPlayer(id));

    return ranking;
  }

  ready() {
    for (let key of Object.keys(this.players)) {
      this.players[key].setReady();
    }
  }

  playerExists(id: string) {
    return this.players.hasOwnProperty(id);
  }

  isEmpty() {
    return Object.keys(this.players).length == 0;
  }

  removePlayer(id: string) {
    const player = this.getPlayer(id);

    delete this.players[id];

    if (Object.keys(this.players).length > 0) {
      this.getOwner().setIsOwner(true);
    }

    return player;
  }
}

export default Room;
