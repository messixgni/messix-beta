import { ChatworkMessageTable, ChatworkRoomTable } from "./dbTable";

export type MessageStatus = "normal" | "unread" | "unreply" | "unmanage";

export type UnreadRoom = {
  rid: string;
  unreadCount: number;
};

export type SetChatworkRoomUnreadsBM = BackgroundMessage & {
  unreadRooms: UnreadRoom[];
};

export type SetChatworkMessageBM = BackgroundMessage & {
  messages: ChatworkMessageData[];
};

export type BackgroundMessage = {
  requestKind: "setChatworkRoomUnreads" | "setChatworkMessage";
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
