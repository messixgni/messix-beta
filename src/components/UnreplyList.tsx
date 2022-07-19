import React, { useState } from "react";
import { useUnreplys } from "../hook/useUnreplys";
import { ChatworkMessageStatusTable, ChatworkMessageTable } from "../interface/dbTable";
import { getTimePastStatus } from "../util";
import ForceCheckedToast from "./ForceCheckedToast";
import UnreplyListItem from "./UnreplyListItem";

const UnreplyList = () => {
  const { isLoading, messages, changeStatus } = useUnreplys();
  const [lastChangedMessage, setLastChangedMessage] = useState<
    ChatworkMessageTable & ChatworkMessageStatusTable
  >();
  if (isLoading) return <p>Loading...</p>;
  const onChangeMessage = (chatworkMessage: ChatworkMessageTable & ChatworkMessageStatusTable) => {
    if (chatworkMessage.isUnreply === 0) {
      setLastChangedMessage(chatworkMessage);
    }
    changeStatus(chatworkMessage);
  };
  const checkSpanNeed = (first: ChatworkMessageTable, last: ChatworkMessageTable): boolean =>
    getTimePastStatus(first.createAt) !== getTimePastStatus(last.createAt);
  return (
    <>
      <div style={{ overflowY: "scroll", maxHeight: "400px" }}>
        {messages === undefined || messages.length === 0 ? <p>未返信リストは空です!</p> : <></>}
        {messages?.map((message, i) => (
          <div key={message.id}>
            {i !== 0 && checkSpanNeed(messages[i - 1], message) ? (
              <div style={{ height: "5px" }}></div>
            ) : (
              <></>
            )}
            <UnreplyListItem chatworkMessage={message} onChange={onChangeMessage} />
          </div>
        ))}
      </div>
      <ForceCheckedToast
        lastChangedMessage={lastChangedMessage}
        onClose={() => {
          setLastChangedMessage(undefined);
        }}
      />
    </>
  );
};

export default UnreplyList;
