import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { UnreadInclusiveStatus } from "../interface";

const useUnreads = () =>
  useLiveQuery(async () => {
    const allManagedRooms = await db.chatworkRoom.toArray();
    const activeRooms = allManagedRooms.filter((elem) => elem.isActive === true);
    const roomStatus = await db.chatworkRoomStatus.bulkGet(activeRooms.map((room) => room.id!));
    const val: UnreadInclusiveStatus[] = [];
    activeRooms.forEach((room) => {
      const object: UnreadInclusiveStatus = {
        id: room.id!,
        rid: room.rid,
        name: room.name,
        unreadCount: roomStatus.find((status) => status?.roomId === room.id)?.unreadCount!,
        hasUnreadMentionedMessage: roomStatus.find((status) => status?.roomId === room.id)
          ?.hasUnreadMentionedMessage!,
      };
      val.push(object);
    });
    return val;
  });
export default useUnreads;
