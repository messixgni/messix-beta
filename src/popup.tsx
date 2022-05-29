import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Container, Col, Row, Button } from "react-bootstrap";
import { ChatworkRoom } from "./interface";
import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";
import UnreplyListItem from "./components/UnreplyListItem";
import SettingPage from "./components/SettignPage";
import ForceCheckedToast from "./components/ForceCheckedToast";
import { ChatworkRoomTable } from "./interface/dbTable";
import { changeBadgeText } from "./util";

const Popup = () => {
  const [unmanagedRoom, setUnmanagedRoom] = useState<ChatworkRoom>();
  const unreads = useLiveQuery(() => db.chatworkRoom.where("status").equals("unread").toArray());
  const unreplys = useLiveQuery(() => db.chatworkRoom.where("status").equals("unreply").toArray());
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
    db.chatworkRoom.add({
      name: unmanagedRoom!.name,
      rid: unmanagedRoom!.rid,
      isActive: true,
      status: "normal",
    });
    setUnmanagedRoom(undefined);
  };
  return (
    <div className="d-flex flex-row" style={{ width: "600px" }}>
      <div className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-light">
        <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
          <img src="messix-logo.png" width="103" height="41" />
          <span className="fs-4"></span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <a href="#" className={"nav-link active"} aria-current="page" onClick={() => setIsUnreadView(true)}>
              <img src="unread.png" width="16" height="16" /> 未読 <span className="badge rounded-pill bg-danger">{
                //unreads && unreads.length === 0 ? "" : ` [${unreads && unreads.length}]`
                10
              }</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className={"nav-link link-dark"} aria-current="page" onClick={() => setIsUnreadView(false)}>
              <img src="unreply.png" width="16" height="16" /> 未返信{unreads && unreads.length === 0 ? "" : ` [${unreads && unreads.length}]`}
            </a>
          </li>
        </ul>
        <div className="sidecar__btm align-items-end">
          <hr />
          <a href="#" className="d-flex link-dark text-decoration-none" onClick={() => { setIsSettingView(!isSettingView); }}>
            <img src="settings.png" alt="" width="16" height="16" className="me-2" /> 設定
          </a>
        </div>
      </div>
      <div className="MainContents">
        {//unmanagedRoom ? ( 
          true ? (
            <div className="managementNotification alert alert-info alert-dismissible fade show" role="alert">
              <p>『<strong>{/*unmanagedRoom.name */ "○○のお部屋"}</strong>』のチャットを通知管理しますか？</p>
              <Button className="btn-sm btn-primary" onClick={onClickAddManageBtn}>はい</Button>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>

          ) : (
            <></>
          )}
        <Col xs={10}>
          {isSettingView ? (
            <SettingPage />
          ) : (
            <>
              {isUnreadView ? (
                <a href="https://www.chatwork.com" target="_blank">
                  {`未読メッセージが${unreads && unreads.length}件あります`}
                </a>
              ) : (
                <>
                  {unreplys && unreplys.map((unreply) => (
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
        </Col>
      </div>
    </div>
  );
};

window.onload = function () {
  const scriptTag = document.createElement("script");
  scriptTag.src = chrome.runtime.getURL("./analytics-override.js");
  scriptTag.type = "text/javascript";
  document.head.appendChild(scriptTag);
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
