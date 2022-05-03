export interface ChatworkRoom {
  id?: number;
  rid: string;
  name: string;
  status: "normal" | "unread" | "unreply";
}

export interface ChatworkMessage {
  id?: number;
  rid: string;
  name: string;
  imgUrl?: string;
  content: string;
  createAt: Date;
}
