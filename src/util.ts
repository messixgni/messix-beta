import { db } from "./db";
import { ClientHits } from "./interface/setting";
export const changeBadgeText = async () => {
  //const unreadCount = await db.chatworkRoom.filter((cr) => cr.status === "unread").count();
  //chrome.action.setBadgeText({ text: unreadCount === 0 ? "" : unreadCount.toString() });
};

export const getTimePastStatus = (time: Date): string => {
  const pastTime = Date.now() - new Date(time).getTime();
  const hours = pastTime / (1000 * 60 * 60);
  if (hours > 24) return "red";
  if (hours > 3) return "yellow";
  return "normal";
};

export const getEnvironment = async () => {
  const messixVer = chrome.runtime.getManifest().version;
  const useAgentData = navigator?.userAgentData;
  let highEntropyValues: ClientHits = await useAgentData.getHighEntropyValues([
    "platform",
    "platformVersion",
    "architecture",
    "model",
    "bitness",
  ]);
  highEntropyValues.messixVer = messixVer;
  return highEntropyValues;
};
