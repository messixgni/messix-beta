import React from "react";
import { useUnreplys } from "../hook/useUnreplys";
import UnreplyListItem from "./UnreplyListItem";

const UnreplyList = () => {
  const { isLoading, messages, changeStatus } = useUnreplys();
  if (isLoading) return <p>Loading...</p>;
  return (
    <>
      {messages?.map((message) => (
        <UnreplyListItem chatworkMessage={message} onChangeToNormal={() => {}} />
      ))}
    </>
  );
};

export default UnreplyList;
