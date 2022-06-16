import { UnreadInclusiveStatus } from "../interface";

export const isUnreadInclusiveStatusArray = (arg: any): arg is UnreadInclusiveStatus[] => {
  return (
    arg !== null &&
    typeof Array.isArray(arg) &&
    arg.length !== 0 &&
    typeof arg[0].unreadCount === "number"
  );
};
export const isUnreadInclusiveStatus = (arg: any): arg is UnreadInclusiveStatus => {
  return arg !== null && typeof arg.unreadCount === "number";
};
