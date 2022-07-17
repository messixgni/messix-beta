import { ChatworkMessageTable, ChatworkRoomTable } from "./dbTable";
import { Stamps } from "./setting";

export type MessageStatus = "normal" | "unread" | "unreply" | "unmanage";

export type UnreadRoom = {
  rid: string;
  unreadCount: number;
};

export type UnreadRoomStatus = UnreadRoom & {
  hasUnreadMentionedMessage: boolean;
};

export type UnreadInclusiveStatus = ChatworkRoom &
  UnreadRoomStatus & {
    id: number;
  };

export type SetChatworkRoomUnreadsBM = BackgroundMessage & {
  unreadRooms: UnreadRoomStatus[];
};

export type SetChatworkMessageBM = BackgroundMessage & {
  messages: (ChatworkMessageData & Stamps)[];
};
export type SetChatworkRoomsBM = BackgroundMessage & {
  rooms: ChatworkExistRoom[];
};

export type BackgroundMessage = {
  requestKind: "setChatworkRoomUnreads" | "setChatworkMessage" | "setChatworkRooms";
};

export type ChatworkRoom = {
  rid: string;
  name: string;
};

export type MessageUser = {
  aid?: string;
  name: string;
  iconUrl?: string;
};

export type ChatworkMessageData = {
  isMentioned: boolean;
  mid: string;
  rid: string;
  content: string;
  createAt: Date;
  aid: string;
  userName: string;
  iconUrl: string;
  replys: string[];
};

export type ChatworkExistRoom = {
  name: string;
  rid: string;
  isPined: boolean;
};
