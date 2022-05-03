const checkNewNotification = () => {
  for (let i = 0; i < document.getElementById("RoomList")!.children!.length; i++) {
    let tabElements = document.getElementById("RoomList")!.children![i];
    for (let n = 0; n < tabElements.children!.length; n++) {
      let roomTabElement = tabElements.children![n];
      const rid = roomTabElement!.getAttribute("data-rid");
      const roomName = roomTabElement!.getAttribute("aria-label");
      const unread = roomTabElement.getElementsByClassName("_unreadBadge").length !== 0;
      console.log(`${rid}:${roomName}:${unread ? "未読あり" : "未読無し"}`);
    }
  }
};
const check = () => {
  checkNewNotification();
};

const loop = setInterval(check, 5000);
