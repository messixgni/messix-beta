import { db, MessixDB } from "./db";
import { BackgroundMessage, BgMsgChatworkRoom, BgMsgChatworkRooms } from "./interface";

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
    const rooms = await db.chatworkRoom.toArray();
    return rooms;
  } catch (err) {
    return undefined;
  }
};
const putChatworkRoom = async (bgMsgChatworkRooms: BgMsgChatworkRooms) => {
  try {
    bgMsgChatworkRooms.data?.forEach((room) => {
      db.chatworkRoom.put(room);
    });
  } catch (err) {}
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const backgroundMessage: BackgroundMessage = message;
  switch (backgroundMessage.requestKind) {
    case "postChatworkRoom":
      postChatworkRoom(message).then((res) => {
        sendResponse(res);
      });
      break;
    case "getChatworkRoom":
      getChatworkRoom().then((res) => {
        sendResponse(res);
      });
      break;
    case "putChatworkRoom":
      putChatworkRoom(message).then((res) => {
        sendResponse(true);
      });

      break;

    case "postChatworkMessage":
      break;
  }
  return true;
});
