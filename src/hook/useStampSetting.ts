import { Stamp, Setting } from "../interface/setting";
import { useState, useEffect } from "react";
import { getSetting } from "../util";

const useStampSetting = (): {
  activeStamps: Stamp[];
  onChangeStampSetting: (stamps: Stamp[]) => void;
} => {
  const [activeStamps, setActiveStamps] = useState<Stamp[]>([]);
  useEffect(() => {
    (async () => {
      const { settingJson } = await getSetting();
      if (!settingJson || !settingJson.autoChangeMessageStatusStamps) return;
      setActiveStamps(settingJson.autoChangeMessageStatusStamps);
    })()
  }, []);
  const onChange = async (stamps: Stamp[]) => {
    setActiveStamps(stamps);
    const { bucket, settingJson } = await getSetting();
    if (!settingJson) return;
    settingJson.autoChangeMessageStatusStamps = stamps;
    bucket.set(settingJson);
  };

  return {
    activeStamps: activeStamps,
    onChangeStampSetting: onChange,
  };
};

export default useStampSetting;
