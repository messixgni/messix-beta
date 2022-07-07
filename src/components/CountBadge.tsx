import React from "react";
import { UnreadInclusiveStatus } from "../interface";
import { ChatworkMessageTable } from "../interface/dbTable";
import { isUnreadInclusiveStatus, isUnreadInclusiveStatusArray } from "../typeguard";

type Props = {
  datas: UnreadInclusiveStatus | UnreadInclusiveStatus[] | ChatworkMessageTable[] | undefined;
};
const CountBadge = ({ datas }: Props) => {
  if (!datas) return <></>; //datasがundefined

  if (isUnreadInclusiveStatus(datas)) {
    //datasがUnreadInclusiveStatus型
    const invisible = datas.unreadCount ? "" : "d-none";
    console.log("datas.hasUnreadMentionedMessage");
    const unreadToMessage = datas.hasUnreadMentionedMessage ? "unreadToMessage" : "";
    return (
      <div
        className={
          invisible +
          " unread-chatwork-room-li d-flex justify-content-between align-items-center w-50 position-relative"
        }
      >
        <a
          className="d-inline-block text-truncate text-decoration-none text-reset stretched-link m-2"
          href={`https://chatwork.com#!rid${datas.rid}`}
          target="_blank"
          style={{ maxWidth: "190px" }}
        >
          {datas.name}
        </a>
        <span className={"badge bg-secondary rounded-pill " + unreadToMessage}>
          {datas.unreadCount}
        </span>
      </div>
    );
  }

  //datasがUnreadInclusiveStatus[] か ChatworkMessageTable[]
  if (datas.length === 0) return <></>; //datasが空配列

  if (isUnreadInclusiveStatusArray(datas)) {
    //datasがUnreadInclusiveStatus[]
    const val = datas.reduce((sum, elem) => {
      return sum + elem.unreadCount;
    }, 0);
    const invisible = val ? "" : "invisible";
    const unreadBadge = val >= 10 ? "9+" : val.toString();
    return <span className={"badge rounded-pill bg-danger " + invisible}>{unreadBadge}</span>;
  }

  //datasがChatworkMessageTable[]
  const unreplyBadge = datas.length >= 10 ? "9+" : datas.length.toString();
  return <span className="badge rounded-pill bg-danger">{unreplyBadge}</span>;
};

export default CountBadge;
