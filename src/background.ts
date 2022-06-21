import { db } from "./db";
import {
  BackgroundMessage,
  ChatworkMessageData,
  SetChatworkMessageBM,
  SetChatworkRoomUnreadsBM,
  UnreadRoomStatus,
} from "./interface";
import { changeBadgeText } from "./util";

const updateTableUnreadCount = async (elem: UnreadRoomStatus) => {
  db.transaction("rw", db.chatworkRoom, db.chatworkRoomStatus, async () => {
    const roomRowMatching = await db.chatworkRoom.where("rid").equals(elem.rid).first();
    if (!roomRowMatching) {
      console.log("NoMatchingRoom(updateTableUnreadCount)");
      return;
    }
    const statusRowMatching = await db.chatworkRoomStatus
      .where("roomId")
      .equals(roomRowMatching.id!)
      .toArray();
    if (statusRowMatching.length === 0) {
      await db.chatworkRoomStatus.put({
        roomId: roomRowMatching.id!,
        unreadCount: elem.unreadCount,
        hasUnreadMentionedMessage: elem.hasUnreadMentionedMessage,
      });
    } else if (statusRowMatching.length >= 2) {
      throw new Error("there is duplication of the same rid room.");
    } else {
      await db.chatworkRoomStatus.update(statusRowMatching[0].id!, {
        roomId: roomRowMatching.id,
        unreadCount: elem.unreadCount,
        hasUnreadMentionedMessage: elem.hasUnreadMentionedMessage,
      });
    }
  })
    .then(() => {
      console.log("Transaction committed(updateTableUnreadCount)");
    })
    .catch((err) => {
      console.error(err.stack);
    });
};

const changeUnreadCount = async (backgroundMessage: SetChatworkRoomUnreadsBM) => {
  backgroundMessage.unreadRooms.forEach((elem) => {
    updateTableUnreadCount(elem);
  });
};

const setChatworkMessages = async (messages: ChatworkMessageData[]) => {
  if (messages.length === 0) return;
  const targetRoom = await db.chatworkRoom.where("rid").equals(messages[0].rid).first();
  if (!targetRoom) return;
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
        //投稿したての正しくないmidのメッセージを排除する
        if (message.mid.length < 4) return;
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
              roomId: targetRoom.id,
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
            roomId: targetRoom.id,
            userId: userId,
            content: message.content,
            createAt: message.createAt,
          });
          const newMessage = await db.chatworkMessage.get(newMessageIndex);
          messageId = newMessage!.id!;
          //MessageStatusの登録
          const newMessageStatusIndex = await db.chatworkMessageStatus.add({
            messageId: messageId,
            isUnreply: message.isMentioned,
            isMarked: false,
          });
        }
        //MessageReplyの登録
        message.replys.forEach(async (replyMid) => {
          //DBへの登録
          const replyTargetMessage = await db.chatworkMessage.where("mid").equals(replyMid).first();
          if (!replyTargetMessage) return;
          const currentMessageReplys = (
            await db.chatworkMessageReply
              .where("replyTargetMessageId")
              .equals(replyTargetMessage.id!)
              .toArray()
          ).filter((msgReply) => msgReply.replyMessageId === messageId);
          if (currentMessageReplys.length === 0) {
            //存在しないため新規登録
            const newMessageReply = await db.chatworkMessageReply.add({
              replyTargetMessageId: replyTargetMessage.id!,
              replyMessageId: messageId,
            });
          }
          //未返信自動解決
          const replyTargetMessageStatus = await db.chatworkMessageStatus
            .where("messageId")
            .equals(replyTargetMessage.id!)
            .first();
          if (replyTargetMessageStatus?.isUnreply) {
            //ユーザーが返信した先のメッセージが未返信状態のとき、未返信ではなくする
            const messageStatusChangeResult = await db.chatworkMessageStatus.put({
              id: replyTargetMessageStatus.id!,
              messageId: replyTargetMessageStatus.messageId,
              isMarked: replyTargetMessageStatus.isMarked,
              isUnreply: false,
            });
          }
        });
      }
    )
      .then(() => {
        console.log("done");
      })
      .catch((err) => {
        console.log(err);
      });
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

const checkBadge = () => {
  db.transaction("r", db.chatworkMessage, db.chatworkMessageStatus, async () => {
    return 0;
  }).then((_res) => {
    if (_res != 0) {
      chrome.action.setBadgeText({ text: _res.toString() });
    }
  });
};

let loop: NodeJS.Timer = setInterval(checkBadge, 1000);
