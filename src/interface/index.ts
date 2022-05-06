import { ChatworkRoomTable } from "./dbTable";

export type BackgroundMessage = {
  requestKind:
    | "postChatworkRoom"
    | "getChatworkRoom"
    | "putChatworkRoom"
    | "deleteChatworkRoom"
    | "postChatworkMessage";
};
export type BgMsgChatworkRoom = BackgroundMessage & {
  data?: ChatworkRoomTable;
};

export type ChatworkRoom = {
  rid: string;
  name: string;
};
