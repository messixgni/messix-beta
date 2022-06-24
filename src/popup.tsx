import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Container, Col, Row, Button } from "react-bootstrap";
import { ChatworkRoom, UnreadInclusiveStatus } from "./interface";
import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";
import UnreplyListItem from "./components/UnreplyListItem";
import SettingPage from "./components/SettignPage";
import ForceCheckedToast from "./components/ForceCheckedToast";
import { ChatworkRoomTable, ChatworkMessageTable } from "./interface/dbTable";
import { changeBadgeText } from "./util";
import { isUnreadInclusiveStatus, isUnreadInclusiveStatusArray } from "./typeguard";
import { useUnreplys } from "./hook/useUnreplys";
import UnreplyList from "./components/UnreplyList";

const Popup = () => {
  const { isLoading, messages, changeStatus } = useUnreplys();
  const [unmanagedRoom, setUnmanagedRoom] = useState<ChatworkRoom>();
  const unreads = useLiveQuery(async () => {
    const allManagedRooms = await db.chatworkRoom.toArray();
    const activeRooms = allManagedRooms.filter((elem) => elem.isActive === true);
    const roomStatus = await db.chatworkRoomStatus.bulkGet(activeRooms.map((room) => room.id!));
    const val: UnreadInclusiveStatus[] = [];
    activeRooms.forEach((room) => {
      const object: UnreadInclusiveStatus = {
        id: room.id!,
        rid: room.rid,
        name: room.name,
        unreadCount: roomStatus.find((status) => status?.roomId === room.id)?.unreadCount!,
        hasUnreadMentionedMessage: roomStatus.find((status) => status?.roomId === room.id)
          ?.hasUnreadMentionedMessage!,
      };
      val.push(object);
    });
    return val;
  });
  const unreply = useUnreplys();
  const [isUnreadView, setIsUnreadView] = useState<boolean>(false);
  const [isSettingView, setIsSettingView] = useState<boolean>(false);
  useEffect(() => {
    const getBrowserActiveTabInfo = async () => {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      if (!tab.url) return;
      if (tab.url!.indexOf("chatwork.com") === -1) return;
      const rid = tab.url!.substring(30);
      if ((await db.chatworkRoom.where({ rid: rid }).count()) !== 0) return;
      setUnmanagedRoom({
        name: tab.title!.match(/((\[.*\])?Chatwork - )(.*)/)![3], // 正規表現でGroup3にルーム名がダイレクトヒットする
        rid: rid,
      });
    };
    getBrowserActiveTabInfo();
    changeBadgeText();
  }, []);
  const onClickAddManageBtn = (isActive: boolean) => {
    db.transaction("rw", db.chatworkRoom, db.chatworkRoomStatus, async () => {
      const index = await db.chatworkRoom.add({
        name: unmanagedRoom!.name,
        rid: unmanagedRoom!.rid,
        isActive: isActive,
        activeAt: new Date(Date.now()),
      });
      const room = await db.chatworkRoom.get(index);
      if (!room) throw "ChatworkRoomNotFound";
      await db.chatworkRoomStatus.add({
        roomId: room.id!,
        unreadCount: 0,
        hasUnreadMentionedMessage: false,
      });
    })
      .then(() => {
        setUnmanagedRoom(undefined);
      })
      .catch((err) => {
        console.log("ErrorOnAddChatworkRoom");
      });
  };
  const getCountBadge = (
    datas: UnreadInclusiveStatus | UnreadInclusiveStatus[] | ChatworkMessageTable[] | undefined
  ) => {
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
  return (
    <div className="d-flex flex-row" style={{ width: "665px" }}>
      <div className="sidebar d-flex flex-column flex-shrink-0 p-2 bg-light">
        <a
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
        >
          <img src="messix-logo.png" width="103" height="41" />
          <span className="fs-4"></span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <a
              href="#"
              className={!isUnreadView ? "nav-link active" : "nav-link link-dark"}
              aria-current="page"
              onClick={() => setIsUnreadView(false)}
            >
              <img src="unreply.png" width="16" height="16" /> 未返信{" "}
              {getCountBadge(unreply.messages)}
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className={isUnreadView ? "nav-link active" : "nav-link link-dark"}
              aria-current="page"
              onClick={() => setIsUnreadView(true)}
            >
              <img src="unread.png" width="16" height="16" /> 未読 {getCountBadge(unreads)}
            </a>
          </li>
        </ul>
        <div className="sidecar__btm align-items-end">
          <hr />
          <a
            href="#"
            className="d-flex link-dark text-decoration-none"
            onClick={() => {
              setIsSettingView(!isSettingView);
            }}
          >
            <img src="settings.png" alt="" width="16" height="16" className="me-2" />{" "}
            {isSettingView ? "戻る" : "設定"}
          </a>
        </div>
      </div>
      <div className="MainContents" style={{ width: "500px" }}>
        {unmanagedRoom ? (
          <div
            className="managementNotification alert alert-info alert-dismissible fade show"
            role="alert"
          >
            <p>
              『<strong>{unmanagedRoom.name}</strong>』のチャットを通知管理しますか？
            </p>
            <Button
              className="btn-sm btn-primary"
              onClick={() => {
                onClickAddManageBtn(true);
              }}
            >
              はい
            </Button>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              onClick={() => {
                onClickAddManageBtn(false);
              }}
            ></button>
          </div>
        ) : (
          <></>
        )}
        <div>
          {isSettingView ? (
            <SettingPage />
          ) : (
            <>
              {isUnreadView ? (
                <>
                  <div className="d-flex align-items-center h2 fw-bold m-2">
                    <img src="icon_chatwork.png" className="img-fluid" style={{ height: "1em" }} />
                    Chatwork
                  </div>
                  {unreads ? <>{unreads.map((unread) => getCountBadge(unread))}</> : <></>}
                </>
              ) : (
                <UnreplyList />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/*
window.onload = function () {
  const scriptTag = document.createElement("script");
  scriptTag.src = chrome.runtime.getURL("./analytics-override.js");
  scriptTag.type = "text/javascript";
  document.head.appendChild(scriptTag);
};
*/

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
