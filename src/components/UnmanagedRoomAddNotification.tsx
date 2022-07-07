import React from "react";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { db } from "../db";
import { ChatworkRoom } from "../interface";
import { changeBadgeText } from "../util";

type Props = {
  onCancel: (room: ChatworkRoom) => void;
};

const UnmanagedRoomAddNotification = ({ onCancel }: Props) => {
  const [unmanagedRoom, setUnmanagedRoom] = useState<ChatworkRoom>();
  useEffect(() => {
    const getBrowserActiveTabInfo = async () => {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      if (!tab.url) return;
      if (tab.url!.indexOf("chatwork.com") === -1) return;
      const rid = tab.url!.substring(30);
      if ((await db.chatworkRoom.where({ rid: rid }).count()) !== 0) return;
      setUnmanagedRoom({
        name: tab.title!.match(/((\[.*\])?Chatwork - )(.*)/)![3], // 正規表現でGroup3にルーム名がダイレクトヒットする
        rid: rid,
      });
    };
    getBrowserActiveTabInfo();
    changeBadgeText();
  }, []);
  const onClickAddManageBtn = (isActive: boolean) => {
    db.transaction("rw", db.chatworkRoom, db.chatworkRoomStatus, async () => {
      const index = await db.chatworkRoom.add({
        name: unmanagedRoom!.name,
        rid: unmanagedRoom!.rid,
        isActive: isActive,
        activeAt: new Date(Date.now()),
      });
      const room = await db.chatworkRoom.get(index);
      if (!room) throw "ChatworkRoomNotFound";
      await db.chatworkRoomStatus.add({
        roomId: room.id!,
        unreadCount: 0,
        hasUnreadMentionedMessage: false,
      });
    })
      .then(() => {
        setUnmanagedRoom(undefined);
      })
      .catch((err) => {
        console.log("ErrorOnAddChatworkRoom");
      });
  };
  return (
    <>
      {unmanagedRoom ? (
        <div
          className="managementNotification alert alert-info alert-dismissible fade show"
          role="alert"
        >
          <p>
            『<strong>{unmanagedRoom.name}</strong>』のチャットを通知管理しますか？
          </p>
          <Button
            className="btn-sm btn-primary"
            onClick={() => {
              onClickAddManageBtn(true);
            }}
          >
            はい
          </Button>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => {
              onClickAddManageBtn(false);
              onCancel(unmanagedRoom);
            }}
          ></button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default UnmanagedRoomAddNotification;
