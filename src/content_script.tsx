import {
  SetChatworkRoomUnreadsBM,
  MessageUser,
  UnreadRoom,
  ChatworkMessageData,
  SetChatworkMessageBM,
} from "./interface";
import { ChatworkRoomTable, ChatworkMessageTable } from "./interface/dbTable";

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
  const imgParentElement = doc.getElementsByClassName("_avatarClickTip");
  if (imgParentElement.length === 0) return undefined;
  const aid = imgParentElement[0].getAttribute("data-aid");
  const imgElements = speakers[0].getElementsByTagName("img");
  if (imgElements.length === 0) return undefined;
  const name = imgElements[0].getAttribute("alt");
  const iconUrl = imgElements[0].getAttribute("src");
  if (name === null || iconUrl === null) return undefined;
  const messageUser: MessageUser = {
    aid: aid!,
    name: name,
    iconUrl: iconUrl,
  };
  return messageUser;
};
type GetMessages = () => ChatworkMessageData[];
const getMessages: GetMessages = () => {
  let rtnArray: ChatworkMessageData[] = [];
  let messixUser = getMessixUserMessageUser();
  const rid = location.href.split("rid")[1];
  if (!messixUser) return rtnArray;
  const timeLineEmenents = document.getElementById("_timeLine");
  const messageElements = timeLineEmenents?.getElementsByClassName("_message");
  if (!messageElements) return rtnArray;
  let currentUser: MessageUser | undefined;
  for (let i = 0; i < messageElements.length; i++) {
    const tmpUser = getMessageUser(messageElements[i]);
    const mid = messageElements[i].getAttribute("data-mid");
    if (tmpUser !== undefined) currentUser = tmpUser;
    const spanElements = messageElements[i].getElementsByTagName("span");
    if (spanElements.length === 0 || rid === null) continue;
    const content = spanElements[0].textContent;
    const unixTime = messageElements[i]
      .getElementsByClassName("_timeStamp")[0]
      .getAttribute("data-tm");
    if (content === null || unixTime === null) continue;
    let replys: string[] = [];
    const replyElements = messageElements[i].getElementsByClassName("_replyMessage");
    for (let i = 0; i < replyElements.length; i++) {
      replys.push(replyElements[i].getAttribute("data-mid")!);
    }
    const message: ChatworkMessageData = {
      mid: mid!,
      rid: rid,
      content: content,
      createAt: new Date(parseInt(unixTime) * 1000),
      aid: tmpUser?.aid!,
      userName: tmpUser?.name!,
      iconUrl: tmpUser?.iconUrl!,
      replys: replys,
    };
    rtnArray.push(message);
  }

  return rtnArray;
};

const checkMessages = () => {
  try {
    const messages = getMessages();
    chrome.runtime.sendMessage<SetChatworkMessageBM>({
      requestKind: "setChatworkMessage",
      messages: messages,
    });
  } catch (err) {
    console.log("sendMessageErr");
  }
};

const getUnreadMessages = () => {
  const roomListWrapper = document.getElementById("RoomList");
  const NodeList = roomListWrapper?.querySelectorAll("div#RoomList > ul");
  if (NodeList === undefined) return;
  const roomsList = NodeList[0];
  const rooms = roomsList?.querySelectorAll("li");
  const Message: SetChatworkRoomUnreadsBM = {
    requestKind: "setChatworkRoomUnreads",
    unreadRooms: [],
  };
  rooms?.forEach((elem) => {
    if (elem.querySelector("li")) {
      const rid = elem.getAttribute("data-rid");
      const unreadCount = parseInt(elem.querySelector("li")?.innerText!);
      const unreadRoom: UnreadRoom = {
        rid: rid!,
        unreadCount: unreadCount!,
      };
      Message.unreadRooms.push(unreadRoom);
    }
  });
  chrome.runtime.sendMessage(Message);
};

const check = () => {
  getUnreadMessages();
  checkMessages();
};
let loop: NodeJS.Timer;
if (location.href.indexOf("chatwork.com") !== -1) loop = setInterval(check, 100);
