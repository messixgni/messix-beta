import { ChatworkMessageTable, ChatworkRoomTable } from "./dbTable";

export type MessageStatus = "normal" | "unread" | "unreply" | "unmanage";

export type BackgroundMessage = {
  requestKind:
    | "postChatworkRoom"
    | "getChatworkRoom"
    | "putChatworkRoom"
    | "postChatworkMessage"
    | "getLatestChatworkMessage"
    | "changeRoomStatus";
};
export type BgMsgChatworkRoom = BackgroundMessage & {
  data?: ChatworkRoomTable;
};
export type BgMsgChatworkRooms = BackgroundMessage & {
  data?: ChatworkRoomTable[];
};
export type BgMsgChangeRoomStatus = BackgroundMessage & {
  rid: string;
  status: RoomStatus;
};

export type BgMsgChatworkMessage = BackgroundMessage & {
  data?: ChatworkMessageTable;
  targetRid?: string;
};

export type ChatworkRoom = {
  rid: string;
  name: string;
};

export type MessageUser = {
  name: string;
  iconUrl?: string;
};
