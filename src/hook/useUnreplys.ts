import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { db } from "../db";
import { ChatworkMessageStatusTable, ChatworkMessageTable } from "../interface/dbTable";

type UseUnreplys = () => {
  isLoading: boolean;
  messages: (ChatworkMessageTable & ChatworkMessageStatusTable)[] | undefined;
  changeStatus: (message: ChatworkMessageStatusTable) => void;
};

export const useUnreplys: UseUnreplys = () => {
  const messages = useLiveQuery(async () => {
    const msgStatusList = await db.chatworkMessageStatus.where("isUnreply").equals(1).toArray();
    return Promise.all(
      msgStatusList.map(async (status) =>
        Object.assign({}, status, await db.chatworkMessage.get(status.messageId))
      )
    );
  });
  const changeStatus = async (messageStatus: ChatworkMessageStatusTable) => {
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
  return {
    isLoading: !messages,
    messages: messages,
    changeStatus: changeStatus,
  };
};
