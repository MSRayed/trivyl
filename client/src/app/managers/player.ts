class Player {
  public name: string;
  public id: string;
  public score: number;
  public owner: boolean;

  constructor(name: string, id: string, isOwner: boolean) {
    this.name = name;
    this.id = id;
    this.score = 0;
    this.owner = isOwner;
  }
}

export default Player;
