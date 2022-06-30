import { db } from "./db";
import { Setting } from "./interface/setting";
export const changeBadgeText = async () => {
  //const unreadCount = await db.chatworkRoom.filter((cr) => cr.status === "unread").count();
  //chrome.action.setBadgeText({ text: unreadCount === 0 ? "" : unreadCount.toString() });
};

export const getTimePastStatus = (time: Date): string => {
  const pastTime = Date.now() - new Date(time).getTime();
  const hours = pastTime / (1000 * 60 * 60);
  if (hours > 24) return "red";
  if (hours > 3) return "yellow";
  return "normal";
};

const checkSettingFormat = () => {
  const settingJson = localStorage.getItem("messix-setting");
  if (!settingJson) {
    //設定ファイルの生成
    const newSetting: Setting = {
      howToRestartNotifDone: false,
      autoChangeMessageStatusStamps: ["roger", "bow", "cracker", "dance", "clap", "yes"],
    };
    localStorage.setItem("messix-setting", JSON.stringify(newSetting));
  } else {
    const currentSetting: Setting = JSON.parse(settingJson);
    if (!currentSetting.autoChangeMessageStatusStamps) {
      currentSetting.autoChangeMessageStatusStamps = [
        "roger",
        "bow",
        "cracker",
        "dance",
        "clap",
        "yes",
      ];
    }
    localStorage.setItem("messix-setting", JSON.stringify(currentSetting));
  }
};
checkSettingFormat();
