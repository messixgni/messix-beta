import React from "react";
import { Toast, Button } from "react-bootstrap";
import { db } from "../db";
import { ChatworkRoomTable } from "../interface/dbTable";

type Props = {
  lastChangedRoom: ChatworkRoomTable | undefined;
  onClose: (lastChangedRoom: ChatworkRoomTable) => void;
};

const ForceCheckedToast = ({ lastChangedRoom, onClose }: Props) => {
  const onRestore = async () => {
    if (!lastChangedRoom) return;
    lastChangedRoom.status = "unreply";
    await db.chatworkRoom.put(lastChangedRoom);
    onClose(lastChangedRoom);
  };
  if (!lastChangedRoom) return <></>;
  return (
    <Toast
      show={lastChangedRoom !== undefined}
      onClose={() => {
        onClose(lastChangedRoom!);
      }}
      className="position-fixed bottom-0 end-0"
    >
      <Toast.Header>
        <strong className="me-auto">{lastChangedRoom!.name}</strong>
      </Toast.Header>
      <Toast.Body>
        手動解決済みにしました{" "}
        <Button onClick={onRestore} variant="danger">
          戻す
        </Button>
      </Toast.Body>
    </Toast>
  );
};

export default ForceCheckedToast;
