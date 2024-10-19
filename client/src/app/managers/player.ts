class Player {
  public name: string;
  public id: string;
  public score: number;
  public owner: boolean;
  public ready: boolean;

  constructor(name: string, id: string, isOwner: boolean) {
    this.name = name;
    this.id = id;
    this.score = 0;
    this.owner = isOwner;
    this.ready = false;
  }

  setReady(ready: boolean) {
    this.ready = ready;
  }
}

export default Player;
