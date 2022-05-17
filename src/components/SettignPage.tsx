import { useLiveQuery } from "dexie-react-hooks";
import React from "react";
import { Form } from "react-bootstrap";
import { db } from "../db";
import { ChatworkRoomTable } from "../interface/dbTable";

type ChatworkRoomActiveSwitchProps = {
  room: ChatworkRoomTable;
};
const ChatworkRoomActiveSwitch = ({ room }: ChatworkRoomActiveSwitchProps) => {
  const onChange = () => {
    room.isActive = !room.isActive;
    db.chatworkRoom.put(room);
  };
  return (
    <Form.Switch type="switch" label={room.name} checked={room.isActive} onChange={onChange} />
  );
};

const SettingPage = () => {
  const chatworkRooms = useLiveQuery(() => db.chatworkRoom.toArray());
  return (
    <>
      <h2>設定{"(通知管理)"}</h2>
      <Form>
        {chatworkRooms?.map((cr) => (
          <ChatworkRoomActiveSwitch room={cr} />
        ))}
      </Form>
    </>
  );
};

export default SettingPage;
