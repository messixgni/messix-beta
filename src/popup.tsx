import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Container, Col, Row, Navbar, Button } from "react-bootstrap";
import { ChatworkRoom } from "./interface";
import { db } from "./db";
import { ChatworkRoomTable } from "./interface/dbTable";
import { useLiveQuery } from "dexie-react-hooks";
import UnreplyListItem from "./components/UnreplyListItem";

const Popup = () => {
  const [unmanagedRoom, setUnmanagedRoom] = useState<ChatworkRoom>();
  const unreads = useLiveQuery(() => db.chatworkRoom.where("status").equals("unread").toArray());
  const [unreplys, setUnreplys] = useState<ChatworkRoomTable[]>([]);
  const [isUnreadView, setIsUnreadView] = useState<boolean>(true);
  const getUnreplys = async () => {
    setUnreplys(await db.chatworkRoom.where("status").equals("unreply").toArray());
  };
  useEffect(() => {
    const getBrowserActiveTabInfo = async () => {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      if (tab.url!.indexOf("chatwork.com") === -1) return;
      const rid = tab.url!.substring(30);
      if ((await db.chatworkRoom.where({ rid: rid }).count()) !== 0) return;
      setUnmanagedRoom({
        name: tab.title!.split("-")[1].substring(1),
        rid: rid,
      });
    };
    getBrowserActiveTabInfo();
    getUnreplys();
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
  const changeToNormal = (targetRoom: ChatworkRoomTable) => {
    targetRoom.status = "normal";
    const changeState = async () => {
      await db.chatworkRoom.put(targetRoom);
      getUnreplys();
    };
    changeState();
  };
  return (
    <div style={{ width: "600px" }}>
      <Container fluid>
        <Row style={{ height: "50px", backgroundColor: "lightgray" }}>
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
        </Row>
        {unreads && unreplys ? (
          <Row style={{ height: "400px" }}>
            <Col xs={2} style={{ borderRight: "5px solid lightgray" }}>
              <Row>
                <div
                  className={
                    "d-flex align-items-center popup-tab" +
                    (isUnreadView ? " popup-tab-selected" : "")
                  }
                  onClick={() => setIsUnreadView(true)}
                >
                  <p>未読{unreads.length === 0 ? "" : ` [${unreads.length}]`}</p>
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
                  <p>未返信</p>
                </div>
              </Row>
            </Col>
            <Col xs={10}>
              {isUnreadView ? (
                <a href="https://www.chatwork.com" target="_blank">
                  {`未読メッセージが${unreads.length}件あります`}
                </a>
              ) : (
                <>
                  {unreplys.map((unreply) => (
                    <UnreplyListItem chatworkRoom={unreply} onChangeToNormal={changeToNormal} />
                  ))}
                </>
              )}
            </Col>
          </Row>
        ) : (
          <></>
        )}
      </Container>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
