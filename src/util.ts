import { db } from "./db";
export const changeBadgeText = async () => {
  const unreadCount = await db.chatworkRoom.where("status").equals("unreply").count();
  chrome.action.setBadgeText({ text: unreadCount === 0 ? "" : unreadCount.toString() });
};
