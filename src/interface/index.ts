import { ChatworkMessageTable, ChatworkRoomTable } from "./dbTable";

export type MessageStatus = "normal" | "unread" | "unreply" | "unmanage";

export type UnreadRoom = {
  rid: string;
  unreadCount: number;
};

export type UnreadRoomStatus = UnreadRoom & {
  hasUnreadMentionedMessage: boolean;
};

export type UnreadInclusiveStatus = ChatworkRoom & UnreadRoomStatus & UnreadRoom & {
  id: number;
}

export type SetChatworkRoomUnreadsBM = BackgroundMessage & {
  unreadRooms: UnreadRoomStatus[];
};


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
