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

  deleteRoom(code: string) {
    if (!this.roomExists(code)) {
      console.log("Couldn't find room to delete");
      return;
    }

    delete this.rooms[code];

    return this.getRoom(code);
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
