import { db } from "./db";
import { BackgroundMessage } from "./interface";
import { changeBadgeText } from "./util";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const backgroundMessage: BackgroundMessage = message;
  switch (backgroundMessage.requestKind) {
    case "setChatworkRoomUnreads":
      //ここに未読件数格納処理を書く
      break;
  }
  return true;
});
