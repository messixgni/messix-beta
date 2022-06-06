import { MessageStatus } from ".";

export interface ChatworkRoomTable {
  id?: number;
  rid: string;
  isActive: boolean;
  name: string;
  unreadCount: number;
}

export interface ChatworkMessageTable {
  id?: number;
  roomId?: number;
  mid: string;
  status: MessageStatus;
  isMarked: boolean;
  userName: string;
  userIcon: string;
  content: string;
  createAt: Date;
}
