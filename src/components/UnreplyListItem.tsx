import { useLiveQuery } from "dexie-react-hooks";
import React from "react";
import { Col, Row, Form, Container } from "react-bootstrap";
import { db } from "../db";
import {
  ChatworkMessageStatusTable,
  ChatworkMessageTable,
  ChatworkRoomTable,
} from "../interface/dbTable";

type UnreplyListItemProps = {
  chatworkMessage: ChatworkMessageTable & ChatworkMessageStatusTable;
  onChangeToNormal: (chatworkMessage: ChatworkMessageTable & ChatworkMessageStatusTable) => void;
};

const UnreplyListItem = ({ chatworkMessage, onChangeToNormal }: UnreplyListItemProps) => {
  const messageUser = useLiveQuery(() => db.chatworkUser.get(chatworkMessage.userId));
  const messageRoom = useLiveQuery(() => db.chatworkRoom.get(chatworkMessage.roomId!));
  const getReceicedTimeText: (target: Date | undefined) => string = (target) => {
    if (!target) return "";
    try {
      const hour = new Date(target).getHours().toString();
      const min = new Date(target).getMinutes().toString();
      return hour + ":" + min;
    } catch (err) {
      if (err instanceof Error) {
        return err.message;
      }
      return "err";
    }
  };
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
  };
  return (
    <Container>
      <Row>
        <Col xs={2}>
          {messageUser ? (
            <img
              src={messageUser.iconUrl}
              alt=""
              style={{ borderRadius: "50%", maxWidth: "100%" }}
            />
          ) : (
            <></>
          )}
        </Col>
        <Col xs={5}>{chatworkMessage.content}</Col>
        <Col></Col>
        <Col xs={4}></Col>
      </Row>
    </Container>
  );
};

export default UnreplyListItem;
