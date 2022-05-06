import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Container, Col, Row, Navbar, Button } from "react-bootstrap";
import { ChatworkRoom } from "./interface";
import { db } from "./db";
import { ChatworkRoomTable } from "./interface/dbTable";

const Popup = () => {
  const [unmanagedRoom, setUnmanagedRoom] = useState<ChatworkRoom>();
  const [unreads, setUnreads] = useState<ChatworkRoomTable[]>([]);
  useEffect(() => {
    const getBrowserActiveTabInfo = async () => {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      if (tab.url!.indexOf("chatwork.com") === -1) return;
      const rid = tab.url!.substring(30);
      if ((await db.chatworkRoom.where({ rid: rid }).count()) !== 0) return;
      setUnmanagedRoom({
        name: tab.title!.substring(11),
        rid: rid,
      });
    };
    getBrowserActiveTabInfo();
    const getUnreads = async () => {
      const unreadList = await db.chatworkRoom.toArray();
      setUnreads(unreadList);
    };
    getUnreads();
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
        <Row>
          {unreads.map((unread) => (
            <p>
              {unread.name}:{unread.status}
            </p>
          ))}
        </Row>
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
