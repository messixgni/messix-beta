import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import React from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { db } from "../db";
import { ChatworkRoomTable } from "../interface/dbTable";

type ChatworkRoomActiveSwitchProps = {
  room: ChatworkRoomTable;
};
const ChatworkRoomActiveSwitch = ({ room }: ChatworkRoomActiveSwitchProps) => {
  const onChange = () => {
    room.isActive = !room.isActive;
    room.activeAt = new Date(Date.now());
    db.chatworkRoom.put(room);
  };
  return (
    <Form.Switch type="switch" label={room.name} checked={room.isActive} onChange={onChange} />
  );
};

const SettingPage = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const chatworkRooms = useLiveQuery(() => db.chatworkRoom.toArray());
  const copyToClipboard = (target: string) => {
    const copyTarget = document.getElementById(target)!;
    navigator.clipboard.writeText(copyTarget.innerText);
  };
  return (
    <>
      <h2>設定{"(通知管理)"}</h2>
      <Form>
        {chatworkRooms?.map((cr) => (
          <ChatworkRoomActiveSwitch room={cr} />
        ))}
      </Form>
      <hr />
      <Button variant="danger" onClick={handleShow}>
        バグを報告する
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>バグ報告フォームへ遷移</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="bug-report-text-1">Woohoo, you're reading this text in a modal!</div>
          <Button
            onClick={() => {
              copyToClipboard("bug-report-text-1");
            }}
          >
            コピー
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <a href="./">バグ報告フォームへ遷移する</a>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SettingPage;
