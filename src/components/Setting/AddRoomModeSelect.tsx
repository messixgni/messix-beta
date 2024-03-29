import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { db } from "../../db";
import { AddRoomMode } from "../../interface/setting";
import { getSetting } from "../../util";

const AddRoomModeSelect = () => {
  const checkOptions: { label: string; mode: AddRoomMode }[] = [
    { label: "手動で追加するモード", mode: "manual" },
    { label: "ピン止めされたものを自動で追加するモード", mode: "pinAuto" },
    { label: "全てのルームを自動で追加するモード", mode: "allAuto" },
  ];
  const [currentMode, setCurrentMode] = useState<AddRoomMode>("manual");
  useEffect(() => {
    (async () => {
      const [bucket, settingJson] = await getSetting();
      if (!settingJson.addRoomMode) settingJson.addRoomMode = "pinAuto";
      setCurrentMode(settingJson.addRoomMode);
    })();
  }, []);
  const onClick = async (mode: AddRoomMode) => {
    const [bucket, settingJson] = await getSetting();
    settingJson.addRoomMode = mode;
    bucket.set(settingJson);
    setCurrentMode(mode);
    if (mode === "allAuto") {
      const allRoom = await db.chatworkRoom.toArray();
      allRoom.forEach(async (room) => {
        if (room.isActive) return;
        room.isActive = true;
        await db.chatworkRoom.put(room, room.id);
      });
    }
  };
  return (
    <>
      <h2 style={{ marginTop: "5px" }}>通知管理自動追加設定</h2>
      <p>ルームをMessixの管理対象に自動で追加する設定です。</p>
      <Form>
        {checkOptions.map((option) => (
          <Form.Check
            type="radio"
            id={option.mode}
            label={option.label}
            key={option.mode}
            onClick={() => {
              onClick(option.mode);
            }}
            checked={option.mode === currentMode}
          />
        ))}
      </Form>
    </>
  );
};

export default AddRoomModeSelect;
