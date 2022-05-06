import { ChatworkRoom } from "./dbTable";

export type BackgroundMessage = {
  requestKind:
    | "postChatworkRoom"
    | "getChatworkRoom"
    | "putChatworkRoom"
    | "deleteChatworkRoom"
    | "postChatworkMessage";
};
export type BgMsgChatworkRoom = BackgroundMessage & {
  data?: ChatworkRoom;
};
