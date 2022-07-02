import { Stamp, Setting } from "../interface/setting";
import { useState,useEffect } from "react";

const useStampSetting = (): {
  activeStamps: Stamp[];
  onChangeStampSetting: (stamps: Stamp[]) => void;
} => {
  const [activeStamps, setActiveStamps] = useState<Stamp[]>([]);
  useEffect(() => {
    const jsonText = localStorage.getItem("messix-setting");
    if (!jsonText) return;
    const setting: Setting = JSON.parse(jsonText)
  },[]);
  const onChange = (stamps: Stamp[]) => {
    setActiveStamps(stamps)
    const jsonText=localStorage.getItem("messix-setting");
    if(!jsonText)return;
    const setting:Setting=JSON.parse(jsonText);
    setting.autoChangeMessageStatusStamps=stamps
    localStorage.setItem("messix-setting",JSON.stringify(setting))
  }

  return {
    activeStamps: activeStamps,
    onChangeStampSetting: onChange,
  }
};

export default useStampSetting;
