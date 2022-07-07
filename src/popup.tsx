import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ChatworkRoom } from "./interface";
import SettingPage from "./components/SettignPage";
import { useUnreplys } from "./hook/useUnreplys";
import UnreplyList from "./components/UnreplyList";
import HowToRestartNotifToast from "./components/HowToRestartNotifToast";
import UnmanagedRoomAddNotification from "./components/UnmanagedRoomAddNotification";
import CountBadge from "./components/CountBadge";
import useUnreads from "./hook/useUnreads";
import ga from "./ga/ga";

const Popup = () => {
  const [manageCanceledRoom, setManageCanceledRoom] = useState<ChatworkRoom>();
  const unreads = useUnreads();
  const unreply = useUnreplys();
  const [sideMenuSelectIndex, setSideMenuSelectIndex] = useState(0);
  return (
    <div className="d-flex flex-row" style={{ width: "665px" }}>
      <div className="sidebar d-flex flex-column flex-shrink-0 p-2 bg-light">
        <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
          <img src="messix-logo.png" width="103" height="41" />
          <span className="fs-4"></span>
        </div>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <a
              href="#"
              className={sideMenuSelectIndex === 0 ? "nav-link active" : "nav-link link-dark"}
              aria-current="page"
              onClick={() => setSideMenuSelectIndex(0)}
            >
              <img src="unreply.png" width="16" height="16" /> 未返信{" "}
              <CountBadge datas={unreply.messages} />
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className={sideMenuSelectIndex === 1 ? "nav-link active" : "nav-link link-dark"}
              aria-current="page"
              onClick={() => setSideMenuSelectIndex(1)}
            >
              <img src="unread.png" width="16" height="16" /> 未読 <CountBadge datas={unreads} />
            </a>
          </li>
          <li className="sidecar__btm align-items-end nav-item">
            <hr />
            <a
              href="#"
              className={sideMenuSelectIndex === 2 ? "nav-link active" : "nav-link link-dark"}
              aria-current="page"
              onClick={() => {
                setSideMenuSelectIndex(2);
              }}
            >
              <img src="settings.png" alt="" width="16" height="16" className="me-2" />
              {" 設定"}
            </a>
          </li>
        </ul>
      </div>
      <div className="MainContents" style={{ width: "500px" }}>
        <UnmanagedRoomAddNotification
          onCancel={(room) => {
            setManageCanceledRoom(room);
          }}
        />
        <HowToRestartNotifToast roomName={manageCanceledRoom?.name} />
        <div>
          {sideMenuSelectIndex === 2 ? (
            <SettingPage />
          ) : (
            <>
              {sideMenuSelectIndex === 1 ? (
                <>
                  {unreads ? (
                    <>
                      {unreads.map((unread) => (
                        <CountBadge datas={unread} />
                      ))}
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <UnreplyList />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

window.onload = ga;

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
