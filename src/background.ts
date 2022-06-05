import { db } from "./db";
import { BackgroundMessage, unreadRoom } from "./interface";
import { changeBadgeText } from "./util";

const updateTableUnreadCount = async (elem:unreadRoom) => {
  const rowMatchingRid = await db.chatworkRoom.where('rid').equals(elem.rid).toArray();
  if (rowMatchingRid[0].id === undefined) { return; }
  await db.chatworkRoom.update(rowMatchingRid[0].id, {unreadCount: elem.unreadCount});
}

const changeUnreadCount = async (backgroundMessage: BackgroundMessage) => {
  backgroundMessage.unreadRooms.forEach((elem) => {
    updateTableUnreadCount(elem);
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const backgroundMessage: BackgroundMessage = message;
  switch (backgroundMessage.requestKind) {
    case "setChatworkRoomUnreads":
      changeUnreadCount(backgroundMessage);
      break;
  }
  return true;
});
