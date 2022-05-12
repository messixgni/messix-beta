import { db, MessixDB } from "./db";
import {
  BackgroundMessage,
  BgMsgChangeRoomStatus,
  BgMsgChatworkMessage,
  BgMsgChatworkRoom,
  BgMsgChatworkRooms,
} from "./interface";

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
const getLatestChatworkMessage = async (bgMsgChatworkMessage: BgMsgChatworkMessage) => {
  try {
    const messages = await db.chatworkMessage
      .filter((cm) => cm.rid === bgMsgChatworkMessage.targetRid)
      .sortBy("createAt");
    if (messages.length === 0) return undefined;
    return messages[messages.length - 1];
  } catch (err) {
    return undefined;
  }
};
const changeRoomStatus = async (bgMsgChangeRoomStatus: BgMsgChangeRoomStatus) => {
  try {
    const targetRoom = await db.chatworkRoom
      .filter((cr) => cr.rid === bgMsgChangeRoomStatus.rid.toString())
      .toArray();
    if (targetRoom.length === 0) return false;
    targetRoom[0].status = bgMsgChangeRoomStatus.status;
    await db.chatworkRoom.put(targetRoom[0]);
    return true;
  } catch (err) {
    return false;
  }
};
const postChatworkMessage = async (bgMsgChatworkMessage: BgMsgChatworkMessage) => {
  try {
    await db.chatworkMessage.add(bgMsgChatworkMessage.data!);
    return true;
  } catch (err) {
    return false;
  }
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
    case "changeRoomStatus":
      changeRoomStatus(message).then((res) => {
        sendResponse(res);
      });
      break;
    case "postChatworkMessage":
      postChatworkMessage(message).then((res) => sendResponse(res));
      break;
    case "getLatestChatworkMessage":
      getLatestChatworkMessage(message).then((res) => sendResponse(res));
      break;
  }
  return true;
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.url?.indexOf("chatwork.com") === -1 || tab.url?.indexOf("rid") === -1) return;
  const result = await db.chatworkRoom
    .filter((room) => room.rid === tab.url?.split("rid")[1])
    .toArray();
  if (result.length === 0) return;
  const target = result[0];
  if (target.status !== "unread") return;
  target.status = "unreply";
  db.chatworkRoom.put(target);
});
