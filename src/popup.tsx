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
    <div style={{ width: "600px" }}>
      <Container fluid>
        <Row style={{ height: "50px", backgroundColor: "lightgray" }}>
          {isSettingView ? (
            <></>
          ) : (
            <>
              {unmanagedRoom ? (
                <>
                  <Col xs={10} className="d-flex align-items-center">
                    <p>『{unmanagedRoom.name}』のチャットを通知管理しますか？</p>
                  </Col>
                  <Col xs={2} className="d-flex align-items-center">
                    <Button onClick={onClickAddManageBtn}>はい</Button>
                  </Col>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </Row>
        <Row style={{ height: "400px" }}>
          {unreads && unreplys ? (
            <>
              <Col xs={2} style={{ borderRight: "2px solid lightgray" }}>
                <Row>
                  <div
                    className={
                      "d-flex align-items-center popup-tab" +
                      (isUnreadView ? " popup-tab-selected" : "")
                    }
                    onClick={() => setIsUnreadView(true)}
                  >
                    <p className="m-0">未読{unreads.length === 0 ? "" : ` [${unreads.length}]`}</p>
                  </div>
                </Row>
                <Row>
                  <div
                    className={
                      "d-flex align-items-center popup-tab" +
                      (isUnreadView ? "" : " popup-tab-selected")
                    }
                    onClick={() => setIsUnreadView(false)}
                  >
                    <p className="m-0">未返信</p>
                  </div>
                </Row>
                <Row style={{ height: "300px" }} className="d-flex align-items-end">
                  <Button
                    variant="flat"
                    className="mb-2"
                    onClick={() => {
                      setIsSettingView(!isSettingView);
                    }}
                  >
                    {isSettingView ? "戻る" : "設定"}
                  </Button>
                </Row>
              </Col>
              <Col xs={10}>
                {isSettingView ? (
                  <SettingPage />
                ) : (
                  <>
                    {isUnreadView ? (
                      <a href="https://www.chatwork.com" target="_blank">
                        {`未読メッセージが${unreads.length}件あります`}
                      </a>
                    ) : (
                      <>
                        {unreplys.map((unreply) => (
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
            </>
          ) : (
            <></>
          )}
        </Row>
      </Container>
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
