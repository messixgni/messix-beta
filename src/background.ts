import { db } from "./db";
import {
  BackgroundMessage,
  ChatworkMessageData,
  SetChatworkMessageBM,
  SetChatworkRoomUnreadsBM,
  UnreadRoom,
} from "./interface";
import { changeBadgeText } from "./util";

const updateTableUnreadCount = async (elem: UnreadRoom) => {
  const rowMatchingRid = await db.chatworkRoom.where("rid").equals(elem.rid).toArray();
  if (rowMatchingRid[0].id === undefined) {
    return;
  }
  await db.chatworkRoom.update(rowMatchingRid[0].id, { unreadCount: elem.unreadCount });
};

const changeUnreadCount = async (setChatworkRoomUnreadsBM: SetChatworkRoomUnreadsBM) => {
  setChatworkRoomUnreadsBM.unreadRooms.forEach((elem) => {
    updateTableUnreadCount(elem);
  });
};

const setChatworkMessages = async (messages: ChatworkMessageData[]) => {
  messages.forEach(async (message) => {
    const queryResult = await db.chatworkMessage.where("mid").equals(message.mid).first();
    if (queryResult) return;
    db.transaction(
      "rw",
      db.chatworkMessage,
      db.chatworkMessageStatus,
      db.chatworkUser,
      db.chatworkMessageReply,
      async () => {
        //対象UserIdの取得
        const user = await db.chatworkUser.where("aid").equals(message.aid).first();
        let userId = -1;
        if (!user) {
          const createdUserIndex = await db.chatworkUser.add({
            aid: message.aid,
            name: message.userName,
            iconUrl: message.iconUrl,
          });
          const newUser = await db.chatworkUser.get(createdUserIndex);
          userId = newUser!.id!;
        } else {
          userId = user.id!;
        }
        //Messageの登録
        let messageId = -1;
        const currentMessage = await db.chatworkMessage.where("mid").equals(message.mid).first();
        if (currentMessage) {
          //DBにある（内容が変わっていたら更新）
          messageId = currentMessage.id!;
          if (message.content !== currentMessage.content) {
            //テキスト内容が違う
            const result = await db.chatworkMessage.put({
              id: currentMessage.id,
              mid: currentMessage.mid,
              userId: currentMessage.userId,
              content: message.content,
              createAt: currentMessage.createAt,
            });
          }
        } else {
          //DBに無い（新規登録）
          const newMessageIndex = await db.chatworkMessage.add({
            mid: message.mid,
            userId: userId,
            content: message.content,
            createAt: message.createAt,
          });
          const newMessage = await db.chatworkMessage.get(newMessageIndex);
          messageId = newMessage!.id!;
          //MessageStatusの登録
          const newMessageStatusIndex = await db.chatworkMessageStatus.add({
            messageId: messageId,
            isUnread: message.isMentioned,
            isMarked: false,
          });
        }
        //MessageReplyの登録
        message.replys.forEach(async (replyMid) => {
          //DBへの登録
          const replyTargetMessage = await db.chatworkMessage.where("mid").equals(replyMid).first();
          if (!replyTargetMessage) return;
          const currentMessageReply = await db.chatworkMessageReply
            .where(["replyTargetMessageId", "replyMessageId"])
            .equals([replyTargetMessage.id!, messageId])
            .first();
          if (!currentMessageReply) {
            //存在しないため新規登録
            const newMessageReply = await db.chatworkMessageReply.add({
              replyTargetMessageId: replyTargetMessage.id!,
              replyMessageId: messageId,
            });
          }
          //未返信自動解決
          if (!message.isMentioned) return;
          const replyTargetMessageStatus = await db.chatworkMessageStatus
            .where("messageId")
            .equals(replyTargetMessage.id!)
            .first();
          if (replyTargetMessageStatus?.isUnread) {
            //ユーザーが返信した先のメッセージが未返信状態のとき、未返信ではなくする
            const messageStatusChangeResult = await db.chatworkMessageStatus.put({
              id: replyTargetMessageStatus.id!,
              messageId: replyTargetMessageStatus.messageId,
              isMarked: replyTargetMessageStatus.isMarked,
              isUnread: false,
            });
          }
        });
      }
    );
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const backgroundMessage: BackgroundMessage = message;
  switch (backgroundMessage.requestKind) {
    case "setChatworkRoomUnreads":
      const chatworkRoomUnreadsBM: SetChatworkRoomUnreadsBM = message;
      changeUnreadCount(chatworkRoomUnreadsBM);
      break;
    case "setChatworkMessage":
      const chatworkMessageBM: SetChatworkMessageBM = message;
      console.log(chatworkMessageBM);
      setChatworkMessages(chatworkMessageBM.messages);
  }
  return true;
});
