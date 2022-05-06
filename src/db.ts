import Dexie, { Table } from "dexie";
import { ChatworkMessageTable, ChatworkRoomTable } from "./interface/dbTable";
const dbName = "messix_mvp1";

export class MessixDB extends Dexie {
  chatworkRoom!: Table<ChatworkRoomTable>;
  chatworkMessage!: Table<ChatworkMessageTable>;

  constructor() {
    super(dbName);
    this.version(1).stores({
      chatworkRoom: "++id, rid, isActive, name, status",
      chatworkMessage: "++id, roomId, name, content, createAt",
    });
  }
}

export const db = new MessixDB();
