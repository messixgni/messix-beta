export interface ChatworkRoomTable {
  id?: number;
  rid: string;
  isActive: boolean;
  name: string;
  status: "normal" | "unread" | "unreply";
}

export interface ChatworkMessageTable {
  id?: number;
  roomId: number;
  name: string;
  content: string;
  createAt: Date;
}
