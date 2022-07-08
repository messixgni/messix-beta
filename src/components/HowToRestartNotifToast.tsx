import React, { useEffect, useState } from "react";
import { Setting } from "../interface/setting";
import { getSetting } from "../util";

type Props = {
  roomName: string | undefined;
};

const HowToRestartNotifToast = ({ roomName }: Props) => {
  const [view, setView] = useState(true);
  useEffect(() => {
    if (!roomName) return;
    (async () => {
      const { settingJson } = await getSetting("messix-setting");
      if (settingJson) {
        setView(!settingJson.howToRestartNotifDone);
      }
    })();
    //10秒後に消す
    setTimeout(() => {
      setView(false);
    }, 10000);
  }, [roomName]);
  if (!view || !roomName) return <></>;
  return (
    <>
      <div
        className="managementNotification alert alert-warning alert-dismissible fade show"
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
