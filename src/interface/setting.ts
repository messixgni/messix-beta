export type Stamp = "roger" | "bow" | "cracker" | "dance" | "clap" | "yes";

export type Setting = {
  howToRestartNotifDone: boolean;
  autoChangeMessageStatusStamps?: Stamp[];
};

export type Stamps = {
  stamps: Stamp[];
};
