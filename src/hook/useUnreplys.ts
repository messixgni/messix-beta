import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { db } from "../db";
import { ChatworkMessageStatusTable, ChatworkMessageTable } from "../interface/dbTable";

type UseUnreplys = () => {
  isLoading: boolean;
  messages: (ChatworkMessageTable & ChatworkMessageStatusTable)[] | undefined;
  changeStatus: (message: ChatworkMessageTable & ChatworkMessageStatusTable) => void;
};

export const useUnreplys: UseUnreplys = () => {
  const messages = useLiveQuery(async () => {
    const msgStatusList = await db.chatworkMessageStatus
      .filter((ms) => ms.isUnreply === true)
      .toArray();
    return Promise.all(
      msgStatusList.map(async (status) =>
        Object.assign({}, status, await db.chatworkMessage.get(status.messageId))
      )
    );
  });
  const changeStatus = async (message: ChatworkMessageTable & ChatworkMessageStatusTable) => {
    const status: ChatworkMessageStatusTable = message;
    await db.chatworkMessageStatus.put(status);
  };
  return {
    isLoading: !messages,
    messages: messages,
    changeStatus: changeStatus,
  };
};
