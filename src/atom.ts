import { atom } from "recoil";

export const logsState = atom<string[]>({
  key: "log",
  default: [],
});
