import { useLiveQuery } from "dexie-react-hooks";
import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { db } from "../db";
import { useLog } from "../hook/useLog";
import { ChatworkRoomTable } from "../interface/dbTable";
import { getEnvironment } from "../util";
import { ClientHits } from "../interface/setting";
import { Stamp } from "../interface/setting";
import { allStamps } from "../util";
import useStampSetting from "../hook/useStampSetting";

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
  const bugText = useRef<HTMLInputElement>(null);
  const copyButton = useRef<HTMLButtonElement>(null);
  const [show, setShow] = useState(false);
  const [report, setReport] = useState<Report>();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { logs } = useLog();
  const chatworkRooms = useLiveQuery(() => db.chatworkRoom.toArray());
  const copyToClipboard = () => {
    if (bugText.current === null) return;
    if (copyButton.current === null) return;
    const copyTarget = bugText.current.placeholder;
    console.log(copyTarget);
    navigator.clipboard.writeText(copyTarget);
    copyButton.current.innerText = "Copied!!";
  };
  const { activeStamps, onChangeStampSetting } = useStampSetting();
  const onChangeStampSwitch = (
    e: React.ChangeEvent<HTMLInputElement>,
    stamp: { name: Stamp; title: string }
  ) => {
    if (e.target.checked) {
      onChangeStampSetting([...activeStamps, stamp.name]);
    } else {
      onChangeStampSetting(activeStamps.filter((st) => st !== stamp.name));
    }
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
      <h2 style={{ marginTop: "5px" }}>スタンプで解決</h2>
      <p>
        メンションがついているメッセージにスタンプを付けることで、返信として扱うオプションです。
      </p>
      <div style={{ marginLeft: "20px" }}>
        <h4>対象スタンプ</h4>
        <Form>
          {allStamps.map((stamp) => (
            <Form.Switch
              type="switch"
              label={
                <>
                  <img src={`img/${stamp.name}.svg`} alt="ロゴ" width="20" height="20" />
                  {stamp.title}
                </>
              }
              checked={activeStamps.find((st) => st === stamp.name) !== undefined}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChangeStampSwitch(e, stamp);
              }}
            />
          ))}
        </Form>
      </div>
      <hr />
      <Button variant="danger" onClick={handleShow} style={{ marginBottom: "5px" }}>
        バグを報告する
      </Button>
      <Modal show={show} onHide={handleClose} centered={true} className="overflow-hidden">
        <Modal.Header closeButton>
          <Modal.Title className="fs-6">バグ報告フォームへ遷移</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            onClick={() => {
              copyToClipboard();
            }}
            ref={copyButton}
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
              ref={bugText}
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
