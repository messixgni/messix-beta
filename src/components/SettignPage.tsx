import { useLiveQuery } from "dexie-react-hooks";
import React from "react";
import { Form } from "react-bootstrap";
import { db } from "../db";
import useStampSetting from "../hook/useStampSetting";
import { ChatworkRoomTable } from "../interface/dbTable";
import { Stamp } from "../interface/setting";
import { allStamps } from "../util";

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
    </>
  );
};

export default SettingPage;
