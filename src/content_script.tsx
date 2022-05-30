import {
  BackgroundMessage,
  BgMsgChangeRoomStatus,
  BgMsgChatworkMessage,
  BgMsgChatworkRooms,
  MessageUser,
} from "./interface";
import { ChatworkRoomTable, ChatworkMessageTable } from "./interface/dbTable";

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
type GetMessixUserMessageUser = () => MessageUser | undefined;
const getMessixUserMessageUser: GetMessixUserMessageUser = () => {
  const roomMemberAreaElement = document.getElementById("roomMemberArea");
  if (!roomMemberAreaElement) return undefined;
  const userImgs = roomMemberAreaElement.getElementsByTagName("img");
  if (userImgs.length === 0) return undefined;
  const name = userImgs[0].getAttribute("alt");
  const iconUrl = userImgs[0].getAttribute("src");
  if (name === null || iconUrl === null) return undefined;
  return {
    name: name,
    iconUrl: iconUrl,
  };
};
const getMessageUser = (doc: Element) => {
  const speakers = doc.getElementsByClassName("_speaker");
  if (speakers.length === 0) return undefined;
  const imgElements = speakers[0].getElementsByTagName("img");
  if (imgElements.length === 0) return undefined;
  const name = imgElements[0].getAttribute("alt");
  const iconUrl = imgElements[0].getAttribute("src");
  if (name === null || iconUrl === null) return undefined;
  const messageUser: MessageUser = {
    name: name,
    iconUrl: iconUrl,
  };
  return messageUser;
};
type GetMessages = () => ChatworkMessageTable[];
const getMessages: GetMessages = () => {
  let rtnArray: ChatworkMessageTable[] = [];
  let messixUser = getMessixUserMessageUser();
  const rid = location.href.split("rid")[1];
  if (!messixUser) return rtnArray;
  const timeLineEmenents = document.getElementById("_timeLine");
  const messageElements = timeLineEmenents?.getElementsByClassName("_message");
  if (!messageElements) return rtnArray;
  let currentUser: MessageUser | undefined;
  for (let i = 0; i < messageElements.length; i++) {
    const tmpUser = getMessageUser(messageElements[i]);
    if (tmpUser !== undefined) currentUser = tmpUser;
    const spanElements = messageElements[i].getElementsByTagName("span");
    if (spanElements.length === 0 || rid === null) continue;
    const content = spanElements[0].textContent;
    const unixTime = messageElements[i]
      .getElementsByClassName("_timeStamp")[0]
      .getAttribute("data-tm");
    if (content === null || unixTime === null) continue;
    const message: ChatworkMessageTable = {
      rid: rid,
      name: currentUser?.name!,
      iconUrl: currentUser?.iconUrl,
      content: content,
      createAt: new Date(parseInt(unixTime) * 1000),
    };
    rtnArray.push(message);
  }

  return rtnArray;
};
const checkReply = () => {
  if (location.href.indexOf("chatwork.com") !== -1 && location.href.indexOf("rid") !== -1) {
    const rid = location.href.split("rid")[1];
    const messages = getMessages();
    for (let i = 0; i < messages.length; i++) {
      console.log(`${messages[i].name}:${messages[i].content}`);
    }
    const latestMessage = messages[messages.length - 1];
    //最後のMessageがユーザー自身のものか検証

    const messixUser = getMessixUserMessageUser();
    console.log(`${latestMessage.name}:${messixUser?.name}`);
    console.log(`${latestMessage.iconUrl}:${messixUser?.iconUrl}`);
    if (latestMessage.name === messixUser?.name && latestMessage.iconUrl === messixUser.iconUrl) {
      chrome.runtime.sendMessage<BgMsgChangeRoomStatus, boolean>({
        requestKind: "changeRoomStatus",
        rid: rid,
        status: "normal",
      });
    }

    //最後のMessageをDBに格納
    const sendMessage: BgMsgChatworkMessage = {
      requestKind: "getLatestChatworkMessage",
      targetRid: rid,
    };
    chrome.runtime.sendMessage<BgMsgChatworkMessage, ChatworkMessageTable | undefined>(
      sendMessage,
      (res) => {
        console.log(res);
        if (!res) {
          chrome.runtime.sendMessage<BgMsgChatworkMessage, boolean>(
            {
              requestKind: "postChatworkMessage",
              data: latestMessage,
            },
            (result) => {}
          );
        } else if (res.createAt !== latestMessage.createAt) {
          chrome.runtime.sendMessage<BgMsgChatworkMessage, boolean>(
            {
              requestKind: "postChatworkMessage",
              data: latestMessage,
            },
            (result) => {}
          );
        }
      }
    );
  }
};
const check = () => {
  //未読メッセージの確認
  checkNewNotification();
  //未返信メッセージ確認
  checkReply();
};
let loop: NodeJS.Timer;
if (location.href.indexOf("chatwork.com") !== -1) loop = setInterval(check, 100);
