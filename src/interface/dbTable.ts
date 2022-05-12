import { RoomStatus } from ".";

export interface ChatworkRoomTable {
  id?: number;
  rid: string;
  isActive: boolean;
  name: string;
  status: RoomStatus;
}

export interface ChatworkMessageTable {
  id?: number;
  rid: string;
  name: string;
  iconUrl?: string;
  content: string;
  createAt: Date;
}
