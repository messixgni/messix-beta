import React, { useEffect, useState } from "react";
import { useLog } from "../hook/useLog";
import { Setting } from "../interface/setting";
import { getSetting } from "../util";

type Props = {
  roomName: string | undefined;
};

const HowToRestartNotifToast = ({ roomName }: Props) => {
  const [view, setView] = useState(true);
  const { setLog } = useLog();
  useEffect(() => {
    if (!roomName) return;
    (async () => {
      const [bucket, settingJson] = await getSetting();
      if (settingJson) {
        setView(!settingJson.howToRestartNotifDone);
      }
    })();
    //10秒後に消す
    setTimeout(() => {
      setLog("auto_closehowtorestartnotif");
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
            setLog("click_closehowtorestartnotif");
            setView(false);
          }}
        ></button>
      </div>
    </>
  );
};

export default HowToRestartNotifToast;
