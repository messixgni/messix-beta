export type Setting = {
  howToRestartNotifDone: boolean;
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
