import React, { useEffect, useState } from "react";
import { Setting } from "../interface/setting";

type Props = {
  roomName: string | undefined;
};

const HowToRestartNotifToast = ({ roomName }: Props) => {
  const [view, setView] = useState(true);
  const settingText = localStorage.getItem("messix-setting");
  useEffect(() => {
    if (!roomName) return;
    if (settingText !== null) {
      const setting: Setting = JSON.parse(settingText);
      setView(!setting.howToRestartNotifDone);
    } else {
      const newSetting: Setting = { howToRestartNotifDone: true };
      localStorage.setItem("messix-setting", JSON.stringify(newSetting));
    }
    //10秒後に消す
    setTimeout(() => {
      setView(false);
    }, 10000);
  }, [roomName]);
  if (!view || !roomName) return <></>;
  return (
    <>
      <div
        className="managementNotification alert alert-danger alert-dismissible fade show"
        role="alert"
      >
        <p>
          『<strong>{roomName!}</strong>』の通知管理したい場合は設定から出来ます
        </p>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={() => {
            setView(false);
          }}
        ></button>
      </div>
    </>
  );
};

export default HowToRestartNotifToast;
