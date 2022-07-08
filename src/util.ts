import { db } from "./db";
import { Setting, Stamp } from "./interface/setting";
import { getBucket } from "@extend-chrome/storage";
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

const checkSettingFormat = async () => {
  const { bucket, settingJson } = await getSetting("messix-setting");
  if (!settingJson) {
    //設定ファイルの生成
    const newSetting: Setting = {
      howToRestartNotifDone: false,
      autoChangeMessageStatusStamps: ["roger", "bow", "cracker", "dance", "clap", "yes"],
    };
    await bucket.set(newSetting);
  } else {
    if (!settingJson.autoChangeMessageStatusStamps) {
      settingJson.autoChangeMessageStatusStamps = [
        "roger",
        "bow",
        "cracker",
        "dance",
        "clap",
        "yes",
      ];
    }
    await bucket.set(settingJson);
  }
};
checkSettingFormat();

export const allStamps: { name: Stamp; title: string }[] = [
  { name: "roger", title: "了解" },
  { name: "bow", title: "ありがとう" },
  { name: "cracker", title: "おめでとう" },
  { name: "dance", title: "わーい" },
  { name: "clap", title: "すごい" },
  { name: "yes", title: "いいね" },
];

export const getSetting = async (val: string) => {
  const bucket = getBucket<Setting>(val);
  const settingJson = await bucket.get();
  return { bucket, settingJson };
}