import {
  SetChatworkRoomUnreadsBM,
  MessageUser,
  UnreadRoomStatus,
  ChatworkMessageData,
  SetChatworkMessageBM,
  ChatworkExistRoom,
  SetChatworkRoomsBM,
} from "./interface";
import { Stamps, Stamp } from "./interface/setting";

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
type GetMessages = () => (ChatworkMessageData & Stamps)[];
const getMessages: GetMessages = () => {
  let rtnArray: (ChatworkMessageData & Stamps)[] = [];
  let messixUser = getMessixUserMessageUser();
  const rid = location.href.split("rid")[1];
  if (!messixUser) return rtnArray;
  const timeLineEmenents = document.getElementById("_timeLine");
  const messageElements = timeLineEmenents?.getElementsByClassName("_message");
  if (!messageElements) return rtnArray;
  let currentUser: MessageUser | undefined;
  const allStamps: Stamp[] = ["roger", "bow", "cracker", "dance", "clap", "yes"];
  for (let i = 0; i < messageElements.length; i++) {
    const tmpUser = getMessageUser(messageElements[i]);
    const mid = messageElements[i].getAttribute("data-mid");
    if (tmpUser !== undefined) currentUser = tmpUser;
    const preElements = messageElements[i].getElementsByTagName("pre");
    if (preElements.length === 0 || rid === null) continue;
    let content = "";
    for (let i = 0; i < preElements[0].children.length; i++) {
      if (
        preElements[0].children[i].tagName === "SPAN" ||
        preElements[0].children[i].tagName === "A"
      ) {
        content += preElements[0].children[i].textContent + " ";
      }
    }
    const unixTime = messageElements[i]
      .getElementsByClassName("_timeStamp")[0]
      .getAttribute("data-tm");
    if (content === null || unixTime === null) continue;
    let replys: string[] = [];
    const replyElements = messageElements[i].getElementsByClassName("_replyMessage");
    for (let i = 0; i < replyElements.length; i++) {
      replys.push(replyElements[i].getAttribute("data-mid")!);
    }
    const messageElement = messageElements[i].querySelector("div");
    const stampsRaw = messageElement?.querySelectorAll("img")!;
    console.log(stampsRaw);
    let stamps: Stamp[] = [];
    if (stampsRaw.length != 0) {
      stampsRaw.forEach(async (stamp) => {
        const text: Stamp = allStamps.find((element) => element === stamp.getAttribute("alt"))!;
        stamps.push(text);
        return Promise.resolve();
      });
    }
    stamps = stamps.filter((v) => v);
    console.log(stamps);
    const message: ChatworkMessageData & Stamps = {
      isMentioned: messageElements[i].getAttribute("class")?.indexOf("mentioned") !== -1,
      mid: mid!,
      rid: rid,
      content: content,
      createAt: new Date(parseInt(unixTime) * 1000),
      aid: currentUser?.aid!,
      userName: currentUser?.name!,
      iconUrl: currentUser?.iconUrl!,
      replys: replys,
      stamps: stamps,
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
  const roomList = document.querySelectorAll("div#RoomList > ul > li");
  if (roomList === undefined || roomList.length === 0) return;
  const Message: SetChatworkRoomUnreadsBM = {
    requestKind: "setChatworkRoomUnreads",
    unreadRooms: [],
  };
  roomList.forEach((elem) => {
    const rid = elem.getAttribute("data-rid");
    if (elem.querySelectorAll("li > span").length != 0) {
      const style = getComputedStyle(elem.querySelectorAll("li")[0]!, "::after").backgroundColor;
      const hasUnreadMentionedMessage = style.match(/rgba/) ? false : true;
      const unreadCount = parseInt(elem.querySelectorAll("li > span")[0].innerHTML);
      console.log(unreadCount);
      const unreadRoom: UnreadRoomStatus = {
        rid: rid!,
        unreadCount: unreadCount,
        hasUnreadMentionedMessage: hasUnreadMentionedMessage,
      };
      Message.unreadRooms.push(unreadRoom);
    } else {
      const unreadRoom: UnreadRoomStatus = {
        rid: rid!,
        unreadCount: 0,
        hasUnreadMentionedMessage: false,
      };
      Message.unreadRooms.push(unreadRoom);
    }
  });
  chrome.runtime.sendMessage(Message);
};

const getRooms = () => {
  const isAllChatView =
    document
      .getElementById("_roomListContainer")
      ?.innerHTML.toString()
      .indexOf("すべてのチャット") !== -1;
  if (!isAllChatView) return;
  const roomElements = document.getElementById("RoomList")?.children[0].children;
  if (!roomElements) return;
  let rooms: ChatworkExistRoom[] = [];
  for (let i = 0; i < roomElements.length; i++) {
    const roomName = roomElements[i].getAttribute("aria-label");
    const rid = roomElements[i].getAttribute("data-rid");
    const isPined = roomElements[i].getElementsByClassName("_showDescription").length === 0;
    rooms.push({
      name: roomName!,
      rid: rid!,
      isPined: isPined,
    });
  }
  const message: SetChatworkRoomsBM = {
    requestKind: "setChatworkRooms",
    rooms: rooms,
  };
  chrome.runtime.sendMessage(message);
};

const check = () => {
  getUnreadMessages();
  checkMessages();
  getRooms();
};
let loop: NodeJS.Timer;
if (location.href.indexOf("chatwork.com") !== -1) loop = setInterval(check, 100);
