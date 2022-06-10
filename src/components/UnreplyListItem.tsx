import { useLiveQuery } from "dexie-react-hooks";
import React from "react";
import { Col, Row, Form } from "react-bootstrap";
import { db } from "../db";
import { ChatworkMessageTable, ChatworkRoomTable } from "../interface/dbTable";

type UnreplyListItemProps = {
  chatworkRoom: ChatworkMessageTable;
  onChangeToNormal: (chatworkRoom: ChatworkRoomTable) => void;
};

const UnreplyListItem = ({ chatworkRoom, onChangeToNormal }: UnreplyListItemProps) => {
  const latestMessage = useLiveQuery(() => {
    if (chatworkRoom.roomId === undefined) {
      return [];
    }
    return db.chatworkMessage.where("rid").equals(chatworkRoom.roomId).toArray();
  });
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
  const changeToNormal = () => {
    /*chatworkRoom.status = "normal";
    db.chatworkRoom.put(chatworkRoom);
    onChangeToNormal(chatworkRoom);*/
  };
  return (
    <div className="d-flex flex-row align-items-stretch">
      <Form className="">
        <Form.Group className="h-100">
          <Form.Label className="h-100 d-flex align-items-center px-2">
            <Form.Check
              className="unreply-item"
              type={"radio"}
              id={`${chatworkRoom.roomId}-radio`}
              onChange={changeToNormal}
            ></Form.Check>
          </Form.Label>
        </Form.Group>
      </Form>
      <a
        className="d-flex flex-row room-link"
        href={`https://chatwork.com#!rid${chatworkRoom.roomId}`}
        target="_blank"
      >
        <div className="d-flex align-items-center mx-2">
          <div className="" style={{ width: "200px" }}>
            <p className="small fw-bold m-0 text-truncate received-message">
              {/*latestMessage ? latestMessage[0].userName : ""*/}
            </p>
            <p className="m-0 text-truncate received-message">
              {latestMessage ? latestMessage[0].content : ""}
            </p>
          </div>
        </div>
        <div className="d-flex align-items-center mx-2">
          <p className="small received-time m-0">
            {getReceicedTimeText(latestMessage ? latestMessage[0].createAt : undefined)}
          </p>
        </div>
        <div className="align-items-center mx-2">
          <p className="small popup-warning-text m-0">
            {getElapsedTimeText(latestMessage ? latestMessage[0].createAt : undefined)}
            に受信しました。<br></br>返信忘れてませんか？
          </p>
        </div>
      </a>
    </div>
  );
};

export default UnreplyListItem;
