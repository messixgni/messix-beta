import { ChatworkMessageTable, ChatworkRoomTable } from "./dbTable";

export type MessageStatus = "normal" | "unread" | "unreply" | "unmanage";

export type unreadRoom = {
  rid: string;
  unreadCount: number;
};

export type BackgroundMessage = {
  requestKind: "setChatworkRoomUnreads";
  unreadRooms: unreadRoom[];
};

export type ChatworkRoom = {
  rid: string;
  name: string;
};

export type MessageUser = {
  name: string;
  iconUrl?: string;
};
