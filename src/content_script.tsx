import { BackgroundMessage, BgMsgChatworkRooms } from "./interface";
import { ChatworkRoomTable } from "./interface/dbTable";

const checkNewNotification = async () => {
  const sendMessage: BackgroundMessage = { requestKind: "getChatworkRoom" };
  chrome.runtime.sendMessage<BackgroundMessage, ChatworkRoomTable[] | undefined>(
    sendMessage,
    (response) => {
      if (response === undefined || response.length === 0) return;
      //状態が変わっているRoomをdiffListに格納する
      const diffList: ChatworkRoomTable[] = [];
      for (let i = 0; i < document.getElementById("RoomList")!.children!.length; i++) {
        let tabElements = document.getElementById("RoomList")!.children![i];
        for (let n = 0; n < tabElements.children!.length; n++) {
          let roomTabElement = tabElements.children![n];
          const rid = roomTabElement!.getAttribute("data-rid");
          const roomName = roomTabElement!.getAttribute("aria-label");
          const unread = roomTabElement.getElementsByClassName("_unreadBadge").length !== 0;
          if (response.filter((room) => room.rid === rid).length === 0) continue;
          const targetRoom = response.filter((room) => room.rid === rid)[0];
          if (unread && targetRoom.status !== "unread") {
            diffList.push(targetRoom);
            diffList[diffList.length - 1].status = "unread";
          }
        }
      }
      //diffListをDBに適用する
      chrome.runtime.sendMessage<BgMsgChatworkRooms, any>(
        {
          requestKind: "putChatworkRoom",
          data: diffList,
        },
        (res) => {}
      );
    }
  );
};
const check = () => {
  //未読メッセージの確認
  checkNewNotification();
  //未返信メッセージ確認
};
let loop: NodeJS.Timer;
if (location.href.indexOf("chatwork.com") !== -1) loop = setInterval(check, 5000);
