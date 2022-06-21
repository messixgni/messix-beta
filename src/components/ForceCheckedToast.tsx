import React from "react";
import { Toast, Button } from "react-bootstrap";
import { db } from "../db";
import { useUnreplys } from "../hook/useUnreplys";
import {
  ChatworkMessageStatusTable,
  ChatworkMessageTable,
  ChatworkRoomTable,
} from "../interface/dbTable";

type Props = {
  lastChangedMessage: (ChatworkMessageTable & ChatworkMessageStatusTable) | undefined;
  onClose: () => void;
};

const ForceCheckedToast = ({ lastChangedMessage, onClose }: Props) => {
  const { changeStatus } = useUnreplys();
  const onRestore = async () => {
    changeStatus({
      messageId: lastChangedMessage?.messageId!,
      isUnreply: 1,
      isMarked: lastChangedMessage?.isMarked!,
    });
    onClose();
  };
  const getShortText = (text: string): string => {
    if (text.length > 25) return text.substring(0, 25);
    return text;
  };
  if (!lastChangedMessage) return <></>;
  return (
    <Toast
      show={lastChangedMessage !== undefined}
      onClose={() => {
        onClose();
      }}
      className="position-fixed bottom-0 end-0 force-checked-toast"
    >
      <Toast.Header>
        <strong className="me-auto">{getShortText(lastChangedMessage!.content)}</strong>
      </Toast.Header>
      <Toast.Body className="d-flex align-items-center justify-content-between">
        <p className="m-0">手動解決済みにしました </p>
        <Button onClick={onRestore} variant="danger">
          戻す
        </Button>
      </Toast.Body>
    </Toast>
  );
};

export default ForceCheckedToast;
