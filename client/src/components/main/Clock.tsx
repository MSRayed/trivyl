import { SocketContext } from "@/app/socketContext";
import { useContext, useEffect, useState } from "react";

const Clock = () => {
  const socket = useContext(SocketContext);
  const [time, setTime] = useState();

  useEffect(() => {
    socket.on("tick", (clock) => {
      setTime(clock);
    });
  });

  return (
    <div className="rounded-lg bg-primary p-2">
      <p>{time}</p>
    </div>
  );
};

export default Clock;
