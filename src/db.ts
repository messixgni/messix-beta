import Dexie, { Table } from "dexie";
import { ChatworkMessage, ChatworkRoom } from "./interface/dbTable";
const dbName = "messix_mvp1";

export class MessixDB extends Dexie {
  chatworkRoom!: Table<ChatworkRoom>;
  chatworkMessage!: Table<ChatworkMessage>;

  constructor() {
    super(dbName);
    this.version(1).stores({
      chatworkRoom: "++id, rid, name, status",
      chatworkMessage: "++id, rid, name, imgUrl, content, createAt",
    });
  }
}

export const db = new MessixDB();
