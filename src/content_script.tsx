import { BackgroundMessage, MessageUser } from "./interface";
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
    //一時的にエラーを無くすために適当な値が入っている
    const message: ChatworkMessageTable = {
      mid: "",
      status: "normal",
      isMarked: false,
      userName: currentUser?.name!,
      userIcon: currentUser?.iconUrl!,
      content: content,
      createAt: new Date(parseInt(unixTime) * 1000),
    };
    rtnArray.push(message);
  }

  return rtnArray;
};

const check = () => {};
let loop: NodeJS.Timer;
if (location.href.indexOf("chatwork.com") !== -1) loop = setInterval(check, 100);
