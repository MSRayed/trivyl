import Room from "./Room";

class RoomManager {
  public rooms: { [code: string]: Room };

  constructor() {
    this.rooms = {};
  }

  roomExists(code: string) {
    return this.rooms.hasOwnProperty(code);
  }

  addRoom(code: string) {
    const room = new Room(code);
    this.rooms[code] = room;
  }

  getRoom(code: string) {
    return this.rooms[code];
  }

  getRoomOfPlayer(id: string) {
    for (const code of Object.keys(this.rooms)) {
      if (this.rooms[code].playerExists(id)) {
        return this.rooms[code];
      }
    }
  }
}

export default RoomManager;
