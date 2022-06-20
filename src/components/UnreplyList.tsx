import React from "react";
import { db } from "../db";
import { useUnreplys } from "../hook/useUnreplys";
import { ChatworkMessageStatusTable, ChatworkMessageTable } from "../interface/dbTable";
import UnreplyListItem from "./UnreplyListItem";

const UnreplyList = () => {
  const { isLoading, messages, changeStatus } = useUnreplys();
  if (isLoading) return <p>Loading...</p>;
  const onChangeMessage = (chatworkMessage: ChatworkMessageTable & ChatworkMessageStatusTable) => {
    if (chatworkMessage.isUnreply === 0) {
    }
    const dbChange = async (messageStatus: ChatworkMessageStatusTable) => {
      const res = await db.chatworkMessageStatus
        .where("messageId")
        .equals(messageStatus.messageId)
        .first();
      await db.chatworkMessageStatus.put({
        id: res?.id,
        messageId: messageStatus.messageId,
        isUnreply: messageStatus.isUnreply,
        isMarked: messageStatus.isMarked,
      });
    };
    dbChange({
      messageId: chatworkMessage.messageId,
      isUnreply: chatworkMessage.isUnreply,
      isMarked: chatworkMessage.isMarked,
    });
  };
  return (
    <>
      {messages?.map((message) => (
        <UnreplyListItem chatworkMessage={message} onChange={onChangeMessage} />
      ))}
    </>
  );
};

export default UnreplyList;
