import { useLiveQuery } from "dexie-react-hooks";
import React, { ReactText } from "react";
import { Form } from "react-bootstrap";
import { db } from "../db";
import { ChatworkRoomTable } from "../interface/dbTable";
import { Stamp } from "../interface/setting";
import { allStamps, getCurrentSetting } from "../util";

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
  const chatworkRooms = useLiveQuery(() => db.chatworkRoom.toArray());
  const onChangeStampSwitch = (e: React.ChangeEvent<HTMLInputElement>, stamp: { name: Stamp; title: string }) => {

  };
  return (
    <>
      <h2>設定{"(通知管理)"}</h2>
      <Form>
        {chatworkRooms?.map((cr) => (
          <ChatworkRoomActiveSwitch room={cr} />
        ))}
      </Form>

      <h2>スタンプで解決</h2>
      <p>
        メンションがついているメッセージにスタンプを付けることで、返信として扱うオプションです。
      </p>
      <h3>対象スタンプ</h3>
      <Form>
        {allStamps.map((stamp) => (
          <Form.Switch
            type="switch"
            label={stamp.title}
            checked={
              getCurrentSetting()?.autoChangeMessageStatusStamps?.find(
                (st) => st === stamp.name
              ) !== undefined
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChangeStampSwitch(e, stamp);
            }}
          />
        ))}
      </Form>
    </>
  );
};

export default SettingPage;
