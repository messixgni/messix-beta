import { db } from "./db";
export const changeBadgeText = async () => {
  //const unreadCount = await db.chatworkRoom.filter((cr) => cr.status === "unread").count();
  //chrome.action.setBadgeText({ text: unreadCount === 0 ? "" : unreadCount.toString() });
};

export const getTimePastStatus = (time: Date): string => {
  const pastTime = Date.now() - new Date(time).getTime();
  const hours = pastTime / (1000 * 60 * 60);
  if (hours > 24) return "red";
  if (hours > 6) return "yellow";
  return "normal";
};
