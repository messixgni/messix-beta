import { MessageStatus } from ".";

export interface ChatworkRoomTable {
  id?: number;
  rid: string;
  isActive: boolean;
  name: string;
  activeAt: Date;
}

export interface ChatworkRoomStatusTable {
  id?: number;
  roomId: number;
  unreadCount: number;
  hasUnreadMentionedMessage: boolean;
}

export interface ChatworkMessageTable {
  id?: number;
  roomId?: number;
  mid: string;
  userId: number;
  content: string;
  createAt: Date;
}

export interface ChatworkUserTable {
  id?: number;
  aid: string;
  name: string;
  iconUrl: string;
}

export interface ChatworkMessageStatusTable {
  id?: number;
  messageId: number;
  isUnreply: number;
  isMarked: number;
}

export interface ChatworkMessageReplyTable {
  id?: number;
  replyTargetMessageId: number;
  replyMessageId: number;
}
