import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io();

    setSocket(socketInstance);

    // Clean up when the component is unmounted
    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  return socket;
};
