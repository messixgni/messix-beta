import { db, MessixDB } from "./db";
import { BackgroundMessage, BgMsgChatworkRoom } from "./interface";

const postChatworkRoom = async (bgMsgChatworkRoom: BgMsgChatworkRoom) => {
  try {
    const result = await db.chatworkRoom.add(bgMsgChatworkRoom.data!);
  } catch (err) {
    return false;
  }
  return true;
};
const getChatworkRoom = async (bgMsgChatworkRoom: BgMsgChatworkRoom) => {
  try {
    const rooms = await db.chatworkRoom.toArray();
    return rooms;
  } catch (err) {
    return undefined;
  }
};

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const backgroundMessage: BackgroundMessage = message;
  switch (backgroundMessage.requestKind) {
    case "postChatworkRoom":
      const res = await postChatworkRoom(message);
      sendResponse(res);
      break;
    case "getChatworkRoom":
    case "putChatworkRoom":
    case "deleteChatworkRoom":
      break;

    case "postChatworkMessage":
      break;
  }
});
