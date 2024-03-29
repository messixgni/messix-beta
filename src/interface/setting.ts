export type Stamp = "roger" | "bow" | "cracker" | "dance" | "clap" | "yes";
export type AddRoomMode = "manual" | "pinAuto" | "allAuto";

export type Setting = {
  howToRestartNotifDone: boolean;
  autoChangeMessageStatusStamps?: Stamp[];
  addRoomMode?: AddRoomMode;
};

export type Stamps = {
  stamps: Stamp[];
};

export type ClientHits = {
  architecture: string;
  bitness: string;
  brands: { brand: string; version: string }[];
  mobile: boolean;
  model: string;
  platform: string;
  platformVersion: string;
  messixVer?: string;
};
