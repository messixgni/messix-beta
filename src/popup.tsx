import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Container, Col, Row, Button } from "react-bootstrap";
import { ChatworkRoom } from "./interface";
import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";
import UnreplyListItem from "./components/UnreplyListItem";
import SettingPage from "./components/SettignPage";
import ForceCheckedToast from "./components/ForceCheckedToast";
import { ChatworkRoomTable, ChatworkMessageTable } from "./interface/dbTable";
import { changeBadgeText } from "./util";

const Popup = () => {
  const [unmanagedRoom, setUnmanagedRoom] = useState<ChatworkRoom>();
  const unreads = useLiveQuery(
    () => db.chatworkRoom.toArray()
    //db.chatworkRoom.where("unreadCount").above(0).toArray()
  );
  const unreplys = useLiveQuery(
    () => db.chatworkMessage.toArray()
    //db.chatworkMessage.where("status").equals("unreply").toArray()
  );
  const [isUnreadView, setIsUnreadView] = useState<boolean>(true);
  const [isSettingView, setIsSettingView] = useState<boolean>(false);
  const [lastChangedRoom, setLastChangedRoom] = useState<ChatworkRoomTable>();
  useEffect(() => {
    const getBrowserActiveTabInfo = async () => {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      if (!tab.url) return;
      if (tab.url!.indexOf("chatwork.com") === -1) return;
      const rid = tab.url!.substring(30);
      if ((await db.chatworkRoom.where({ rid: rid }).count()) !== 0) return;
      setUnmanagedRoom({
        name: tab.title!.split("-")[1].substring(1),
        rid: rid,
      });
    };
    getBrowserActiveTabInfo();
    changeBadgeText();
  }, []);
  const onClickAddManageBtn = () => {
    db.transaction("rw", db.chatworkRoom, db.chatworkRoomStatus, async () => {
      const index = await db.chatworkRoom.add({
        name: unmanagedRoom!.name,
        rid: unmanagedRoom!.rid,
        isActive: true,
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
  const implementsChatworkRoom = (arg: any): arg is ChatworkRoomTable[] => {
    return (
      arg !== null &&
      typeof Array.isArray(arg) &&
      arg.length !== 0 &&
      typeof arg[0].rid === "string"
    );
  };
  const getCountBadge = (datas: ChatworkRoomTable[] | ChatworkMessageTable[] | undefined) => {
    console.log("datas");
    console.log(datas);
    if (datas) {
      if (datas.length === 0) return <></>;
      if (implementsChatworkRoom(datas)) {
        console.log("yes")
        const display = async () => {
          let totalUnreadCount = 0;
          await new Promise(async (resolve) => {
            for (const elem of datas) {
              totalUnreadCount += await db.transaction(
                "r",
                db.chatworkRoomStatus,
                db.chatworkRoom,
                async () => {
                  const roomRowMatching = await db.chatworkRoom.where("rid").equals(elem.rid).toArray();
                  if (roomRowMatching.length === 0 || roomRowMatching[0].id === undefined) {
                    console.log("NoMatchingRoom");
                    return 0;
                  }
                  const statusRowMatching = await db.chatworkRoomStatus
                    .where("roomId")
                    .equals(roomRowMatching[0].id)
                    .toArray();
                  return statusRowMatching[0].unreadCount ? statusRowMatching[0].unreadCount : 0;
                }
              );
            }
            console.log("totalUnreadCount")
            console.log(totalUnreadCount)
            resolve(totalUnreadCount);
          })
          return totalUnreadCount;
        }
        console.log("excute display()")
        console.log(display());
        // return <span className="badge rounded-pill bg-danger">{}</span>;
      } else {
        console.log("no");
        return <span className="badge rounded-pill bg-danger">{datas.length}</span>;
      }
    }
    return <></>;
  };
  return (
    <div className="d-flex flex-row" style={{ width: "600px" }}>
      <div className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-light">
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
              className={isUnreadView ? "nav-link active" : "nav-link link-dark"}
              aria-current="page"
              onClick={() => setIsUnreadView(true)}
            >
              <img src="unread.png" width="16" height="16" /> 未読 {getCountBadge(unreads)}
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className={!isUnreadView ? "nav-link active" : "nav-link link-dark"}
              aria-current="page"
              onClick={() => setIsUnreadView(false)}
            >
              <img src="unreply.png" width="16" height="16" /> 未返信 {}
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
      <div className="MainContents">
        {unmanagedRoom ? (
          <div
            className="managementNotification alert alert-info alert-dismissible fade show"
            role="alert"
          >
            <p>
              『<strong>{unmanagedRoom.name}</strong>』のチャットを通知管理しますか？
            </p>
            <Button className="btn-sm btn-primary" onClick={onClickAddManageBtn}>
              はい
            </Button>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              onClick={() => {
                setUnmanagedRoom(undefined);
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
                  {unreads ? (
                    <>
                      {unreads.map((unread) => (
                        <div className="d-flex align-items-center position-relative">
                          <a
                            className="text-decoration-none text-reset stretched-link m-2"
                            href={`https://chatwork.com#!rid${unread.rid}`}
                            target="_blank"
                          >
                            {unread.name}
                          </a>
                          <span className="unreadToMessage badge bg-secondary rounded-circle position-relative">
                            {/* {getRoomCountBadge(unread)} */}
                          </span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <>
                  {unreplys &&
                    unreplys.map((unreply) => (
                      <UnreplyListItem
                        chatworkRoom={unreply}
                        onChangeToNormal={(chatworkRoom) => {
                          setLastChangedRoom(chatworkRoom);
                        }}
                      />
                    ))}
                </>
              )}
            </>
          )}
          <ForceCheckedToast
            lastChangedRoom={lastChangedRoom}
            onClose={() => {
              setLastChangedRoom(undefined);
            }}
          />
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
