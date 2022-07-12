import { useLiveQuery } from "dexie-react-hooks";
import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { db } from "../db";
import { useLog } from "../hook/useLog";
import { ChatworkRoomTable } from "../interface/dbTable";
import { getEnvironment } from "../util";
import { ClientHits } from "../interface/setting";

type ChatworkRoomActiveSwitchProps = {
  room: ChatworkRoomTable;
};
const ChatworkRoomActiveSwitch = ({ room }: ChatworkRoomActiveSwitchProps) => {
  const { setLog } = useLog();
  const onChange = () => {
    room.isActive = !room.isActive;
    room.activeAt = new Date(Date.now());
    db.chatworkRoom.put(room);
    setLog("click_roomactiveswitch");
  };
  return (
    <Form.Switch type="switch" label={room.name} checked={room.isActive} onChange={onChange} />
  );
};
type Report = {
  environment: ClientHits;
  actions: string[];
};

const SettingPage = () => {
  const [show, setShow] = useState(false);
  const [report, setReport] = useState<Report>();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { logs } = useLog();
  const chatworkRooms = useLiveQuery(() => db.chatworkRoom.toArray());
  const copyToClipboard = (target: string) => {
    const copyTarget = document.getElementById(target)?.getAttribute("placeholder")!;
    console.log(copyTarget);
    navigator.clipboard.writeText(copyTarget);
    const copyButton = document.getElementById("copyButton");
    copyButton!.innerHTML = "Copied!!";
  };
  useEffect(() => {
    (async () => {
      setReport({
        environment: await getEnvironment(),
        actions: logs,
      });
    })();
  });
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
      <Modal show={show} onHide={handleClose} centered={true} className="overflow-hidden">
        <Modal.Header closeButton>
          <Modal.Title className="fs-6">バグ報告フォームへ遷移</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            onClick={() => {
              copyToClipboard("bug-report-text");
            }}
            variant="outline-primary"
            className="my-2"
            id="copyButton"
          >
            下記のテキストをコピー
          </Button>
          <Button
            variant="link"
            className="m-2"
            href="https://forms.gle/nSVyeaHdiPaLnyzDA"
            target="_blank"
          >
            バグ報告フォームへ遷移する
          </Button>
          <Form.Group>
            <Form.Control
              id="bug-report-text"
              placeholder={JSON.stringify(report)}
              className="text-truncate"
              disabled
            />
          </Form.Group>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SettingPage;
