import { useLiveQuery } from "dexie-react-hooks";
import React, { useState } from "react";
import { Col, Row, Form, Container } from "react-bootstrap";
import { db } from "../db";
import {
  ChatworkMessageStatusTable,
  ChatworkMessageTable,
  ChatworkRoomTable,
} from "../interface/dbTable";
import { getTimePastStatus } from "../util";

type UnreplyListItemProps = {
  chatworkMessage: ChatworkMessageTable & ChatworkMessageStatusTable;
  onChange: (chatworkMessage: ChatworkMessageTable & ChatworkMessageStatusTable) => void;
};

const UnreplyListItem = ({ chatworkMessage, onChange }: UnreplyListItemProps) => {
  const messageUser = useLiveQuery(() => db.chatworkUser.get(chatworkMessage.userId));
  const messageRoom = useLiveQuery(() => db.chatworkRoom.get(chatworkMessage.roomId!));
  const [isHovered, setIsHoverd] = useState(false);
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
  const onClickStar: React.MouseEventHandler<HTMLElement> = (e) => {
    chatworkMessage.isMarked = chatworkMessage.isMarked === 1 ? 0 : 1;
    onChange(chatworkMessage);
    e.stopPropagation();
  };
  const onClickClose: React.MouseEventHandler<HTMLElement> = (e) => {
    chatworkMessage.isUnreply = 0;
    onChange(chatworkMessage);
    e.stopPropagation();
  };
  const onClickItem = () => {
    window.open(
      `https://www.chatwork.com/#!rid${messageRoom ? messageRoom.rid : ""}-${chatworkMessage.mid}`
    );
  };
  return (
    <Container
      className={"unreply-message-" + getTimePastStatus(chatworkMessage.createAt)}
      style={{ width: "500px" }}
      onMouseEnter={() => {
        setIsHoverd(true);
      }}
      onMouseLeave={() => {
        setIsHoverd(false);
      }}
      onClick={onClickItem}
    >
      <Row>
        <div style={{ width: "40px", display: "inline-block" }}>
          <p
            className={isHovered || chatworkMessage.isMarked === 1 ? "" : "d-none"}
            onClick={onClickStar}
            style={{ color: "orange", marginTop: "25px" }}
          >
            {chatworkMessage.isMarked === 1 ? "★" : "☆"}
          </p>
        </div>
        <div style={{ width: "60px", display: "inline-block" }}>
          {messageUser ? (
            <img
              src={messageUser.iconUrl}
              alt=""
              style={{ borderRadius: "50%", maxWidth: "100%", marginTop: "20px" }}
            />
          ) : (
            <></>
          )}
        </div>
        <div style={{ width: "210px", display: "inline-block" }}>
          <Row>
            <h2 style={{ fontSize: "14px" }}>{messageRoom?.name ? messageRoom.name : ""}</h2>
          </Row>
          <Row>
            <h3 style={{ fontSize: "12px" }}>{messageUser?.name ? messageUser.name : ""}</h3>
          </Row>
          <Row>
            <p style={{ fontSize: "11px" }}>{chatworkMessage.content}</p>
          </Row>
        </div>
        <div style={{ width: "48px", display: "inline-block" }}>
          <p style={{ marginTop: "25px" }}>{getReceicedTimeText(chatworkMessage.createAt)}</p>
        </div>
        <div style={{ width: "130px", display: "inline-block" }}>
          <div className="d-flex justify-content-end" style={{ height: "16px" }}>
            <p
              className={isHovered ? "" : "d-none"}
              style={{ width: "16px", fontSize: "16px" }}
              onClick={onClickClose}
            >
              ×
            </p>
          </div>
          <Row>
            <p>
              {getElapsedTimeText(chatworkMessage.createAt)}に<br />
              受信しました
            </p>
          </Row>
        </div>
      </Row>
    </Container>
  );
};

export default UnreplyListItem;
