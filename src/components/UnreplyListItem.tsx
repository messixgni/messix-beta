import React, { useEffect, useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { db } from "../db";
import { ChatworkMessageTable, ChatworkRoomTable } from "../interface/dbTable";

type UnreplyListItemProps = {
  chatworkRoom: ChatworkRoomTable;
  onChangeToNormal?: (chatworkRoomTable: ChatworkRoomTable) => void;
};

const UnreplyListItem = ({ chatworkRoom, onChangeToNormal }: UnreplyListItemProps) => {
  const [latestMessage, setLatestMessage] = useState<ChatworkMessageTable>();
  useEffect(() => {
    //あとでhookにする
    try {
      const getLatestMessage = async () => {
        const messages = await db.chatworkMessage.where("rid").equals(chatworkRoom.rid).toArray();
        if (messages.length === 0) return;
        setLatestMessage(messages[messages.length - 1]);
      };
      getLatestMessage();
    } catch (err) {
      console.log(err);
    }
  }, []);
  const getElapsedTimeText: (target: Date | undefined) => string = (target) => {
    if (!target) return "";
    try {
      const time = Date.now() - new Date(target).getTime();
      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      if (days > 0) {
        return `${days}日前`;
      } else {
        const hours = Math.floor(time / (1000 * 60 * 60));
        if (hours > 0) {
          return `${hours}時間前`;
        } else {
          const minits = Math.floor(time / (1000 * 60));
          return `${minits}分前`;
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        return err.message;
      }
      return "err";
    }
    return "";
  };
  return (
    <Form className="w-100 d-inline-block">
      <Form.Group>
        <Form.Label className="m-auto w-100">
          <Row className="align-items-center py-0">
            <Col xs={"auto"}>
              <Form.Check
                type={"radio"}
                id={`${chatworkRoom.rid}-radio`}
                onChange={() => {
                  if (onChangeToNormal) onChangeToNormal(chatworkRoom!);
                }}
              ></Form.Check>
            </Col>
            <Col className="d-inline-block align-items-center" xs={4}>
              <div className="mx-auto">
                <p className="small fw-bold m-0 text-truncate">{chatworkRoom.name}</p>
                <p className="m-0 text-truncate">{latestMessage ? latestMessage.content : ""}</p>
              </div>
            </Col>
            <Col className="align-items-center text-secondary" xs={"auto"}>
              12:54
            </Col>
            <Col className="align-items-center" xs={"auto"}>
              <p className="small text-danger m-0">
                {getElapsedTimeText(latestMessage ? latestMessage.createAt : undefined)}
                に受信しました。<br></br>返信忘れてませんか？
              </p>
            </Col>
          </Row>
        </Form.Label>
      </Form.Group>
    </Form>
  );
};

export default UnreplyListItem;
