import { useRecoilState } from "recoil";
import { logsState } from "../atom";

type UseLog = () => {
  logs: string[];
  setLog: (log: string) => void;
};

export const useLog: UseLog = () => {
  const [logs, setLogs] = useRecoilState(logsState);
  const setLog = (log: string) => {
    setLogs([...logs, log]);
  };
  return {
    logs: logs,
    setLog: setLog,
  };
};
