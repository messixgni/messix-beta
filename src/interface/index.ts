import { ChatworkMessageTable, ChatworkRoomTable } from "./dbTable";

export type MessageStatus = "normal" | "unread" | "unreply" | "unmanage";

export type BackgroundMessage = {
  requestKind: "setChatworkRoomUnreads";
};

export type ChatworkRoom = {
  rid: string;
  name: string;
};

export type MessageUser = {
  name: string;
  iconUrl?: string;
};
