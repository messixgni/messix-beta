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
const getChatworkRoom = async () => {
  try {
    const rooms = await db.chatworkRoom.where({ isActive: true }).toArray();
    return rooms;
  } catch (err) {
    return undefined;
  }
};

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const backgroundMessage: BackgroundMessage = message;
  switch (backgroundMessage.requestKind) {
    case "postChatworkRoom":
      sendResponse(await postChatworkRoom(message));
      break;
    case "getChatworkRoom":
      sendResponse(await getChatworkRoom());
      break;
    case "putChatworkRoom":
    case "deleteChatworkRoom":
      break;

    case "postChatworkMessage":
      break;
  }
});
