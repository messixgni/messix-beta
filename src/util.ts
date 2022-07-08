import { db } from "./db";
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

const OSCheck = (ua: string): { OS: string; OSVersion: string } => {
  //WindowsはNT系のバージョンで表示されるためそれを直すためのオブジェクト
  const Windowschecker = {
    "NT 5.1": "XP",
    "NT 5.2": "XP(64bit)",
    "NT 6.0": "Vista",
    "NT 6.1": "7",
    "NT 6.2": "8",
    "NT 6.3": "8.1",
    "NT 10.0": "10 or 11", //UAだとWin11の判別ができない
  };

  //Windowsのいずれかのバージョンが含まれるならWindowsとして返す
  for (const [key, winversion] of Object.entries(Windowschecker)) {
    if (ua.indexOf(key) != -1) return { OS: "Windows", OSVersion: winversion };
  }

  //Mac OS Xという文字列が含まれていればMacとして返す
  const macreg: RegExp = RegExp("Mac OS X[^);]+");
  const macver: String = (macreg.exec(ua) ?? ["unknown"])[0];
  if (macver !== "unknown") {
    return { OS: "Mac OS X", OSVersion: macver.replace(/_/g, ".").slice(9, 20) };
  }

  //それ以外はUnknownとして返す
  return { OS: "unknown", OSVersion: "unknown" };
};

//UserAgentを分割する関数
const SeparateUserAgent = (
  ua: string
): { OS: string; OSVersion: string; ChromeVersion: string } => {
  const chromereg = RegExp("Chrome/[0-9.]+");
  const ChromeVersion: string = (chromereg.exec(ua) ?? ["unknown"])[0].slice(7, 20);
  const { OS, OSVersion } = OSCheck(ua);

  return { OS, OSVersion, ChromeVersion };
};

//OS,OSのバージョン,Chromeのバージョン,Messixのバージョンを参照する関数
export const getBrowserInfo = (): {
  UserAgent: string;
  OS: string;
  OSVersion: string;
  ChromeVersion: string;
  MessixVersion: string;
} => {
  //manifest.jsonを読み込んでMessixのバージョンを取得
  const manifest = chrome.runtime.getManifest();
  const MessixVersion = manifest.version;
  //UserAgentを取得
  const UserAgent = navigator.userAgent;
  const { OS, OSVersion, ChromeVersion } = SeparateUserAgent(UserAgent);

  return { UserAgent, OS, OSVersion, ChromeVersion, MessixVersion };
};
