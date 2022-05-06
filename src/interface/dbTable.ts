export interface ChatworkRoom {
  id?: number;
  rid: string;
  isActive: boolean;
  name: string;
  status: "normal" | "unread" | "unreply";
}

export interface ChatworkMessage {
  id?: number;
  roomId: number;
  name: string;
  imgUrl?: string;
  content: string;
  createAt: Date;
}
