type Stamp = "roger" | "bow" | "cracker" | "dance" | "clap" | "yes";

export type Setting = {
  howToRestartNotifDone: boolean;
  autoChangeMessageStatusStamps?: Stamp[];
};
