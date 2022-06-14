import { db } from "./db";
import { BackgroundMessage, SetChatworkRoomUnreadsBM, UnreadRoom } from "./interface";
import { changeBadgeText } from "./util";

const updateTableUnreadCount = async (elem: UnreadRoom) => {
  db.transaction("rw", db.chatworkRoom, db.chatworkRoomStatus, async () => {
    const roomRowMatching = await db.chatworkRoom.where("rid").equals(elem.rid).toArray();
    if (roomRowMatching.length === 0 || roomRowMatching[0].id === undefined) {
      console.log("NoMatchingRoom");
      return;
    }
    const statusRowMatching = await db.chatworkRoomStatus
      .where("roomId")
      .equals(roomRowMatching[0].id)
      .toArray();
    if (statusRowMatching.length === 0) {
      await db.chatworkRoomStatus.put({
        roomId: roomRowMatching[0].id,
        unreadCount: elem.unreadCount,
        hasUnreadMentionedMessage: false,
      });
    } else if (statusRowMatching.length >= 2) {
      throw new Error("there is duplication of the same rid room.");
    } else {
      await db.chatworkRoomStatus.update(statusRowMatching[0].id!, {
        roomId: roomRowMatching[0].id,
        unreadCount: elem.unreadCount,
        hasUnreadMentionedMessage: false,
      });
    }
  })
    .then(() => {
      console.log("Transaction committed");
    })
    .catch((err) => {
      console.error(err.stack);
    });
};

const changeUnreadCount = async (setChatworkRoomUnreadsBM: SetChatworkRoomUnreadsBM) => {
  setChatworkRoomUnreadsBM.unreadRooms.forEach((elem) => {
    updateTableUnreadCount(elem);
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const backgroundMessage: SetChatworkRoomUnreadsBM = message;
  switch (backgroundMessage.requestKind) {
    case "setChatworkRoomUnreads":
      console.log(backgroundMessage);
      changeUnreadCount(backgroundMessage);
      break;
  }
  return true;
});
