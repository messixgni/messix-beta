import Dexie, { Table } from "dexie";
import {
  ChatworkMessageReplyTable,
  ChatworkMessageStatusTable,
  ChatworkMessageTable,
  ChatworkRoomTable,
  ChatworkRoomStatusTable,
  ChatworkUserTable,
} from "./interface/dbTable";
const dbName = "messix_mvp2";

export class MessixDB extends Dexie {
  chatworkRoom!: Table<ChatworkRoomTable>;
  chatworkRoomStatus!: Table<ChatworkRoomStatusTable>;
  chatworkMessage!: Table<ChatworkMessageTable>;
  chatworkUser!: Table<ChatworkUserTable>;
  chatworkMessageStatus!: Table<ChatworkMessageStatusTable>;
  chatworkMessageReply!: Table<ChatworkMessageReplyTable>;

  constructor() {
    super(dbName);
    this.version(1).stores({
      chatworkRoom: "++id, rid, isActive, name, activeAt",
      chatworkRoomStatus: "++id, roomId, unreadCount, hasUnreadMentionedMessage",
      chatworkMessage: "++id, roomId, mid, user, content, createAt",
      chatworkUser: "++id, aid, name, iconUrl",
      chatworkMessageStatus: "++id, messageId, isUnreply, isMarked",
      chatworkMessageReply: "++id, replyTargetMessageId, replyMessageId",
    });
  }
}

export const db = new MessixDB();
