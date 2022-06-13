import { db } from "./db";
import {
  BackgroundMessage,
  SetChatworkMessageBM,
  SetChatworkRoomUnreadsBM,
  UnreadRoom,
} from "./interface";
import { changeBadgeText } from "./util";

const updateTableUnreadCount = async (elem: UnreadRoom) => {
  const rowMatchingRid = await db.chatworkRoom.where("rid").equals(elem.rid).toArray();
  if (rowMatchingRid[0].id === undefined) {
    return;
  }
  await db.chatworkRoom.update(rowMatchingRid[0].id, { unreadCount: elem.unreadCount });
};

const changeUnreadCount = async (setChatworkRoomUnreadsBM: SetChatworkRoomUnreadsBM) => {
  setChatworkRoomUnreadsBM.unreadRooms.forEach((elem) => {
    updateTableUnreadCount(elem);
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const backgroundMessage: BackgroundMessage = message;
  switch (backgroundMessage.requestKind) {
    case "setChatworkRoomUnreads":
      const chatworkRoomUnreadsBM: SetChatworkRoomUnreadsBM = message;
      changeUnreadCount(chatworkRoomUnreadsBM);
      break;
    case "setChatworkMessage":
      const chatworkMessageBM: SetChatworkMessageBM = message;
      console.log(chatworkMessageBM);
  }
  return true;
});
