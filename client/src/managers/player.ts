class Player {
  public name: string;
  public id: string;
  public score: number;
  public owner: boolean;
  public guessed: boolean;

  constructor(name: string, id: string, isOwner: boolean) {
    this.name = name;
    this.id = id;
    this.score = 0;
    this.owner = isOwner;
    this.guessed = false;
  }

  addScore(score: number) {
    this.score += score;
  }

  setIsOwner(owner: boolean) {
    this.owner = owner;
  }

  setGuessed() {
    this.guessed = true;
  }

  setReady() {
    this.guessed = false;
  }
}

export default Player;
