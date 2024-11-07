import React, { useContext, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SocketContext } from "@/app/socketContext";

interface Message {
  text: string;
  type: "join" | "guess" | "leave";
}

const MessageLog = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  return (
    <div className="w-full max-w-md p-4 bg-secondary rounded-lg">
      <ScrollArea className="min-h-[40vh] w-48 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-lg font-bold leading-none">Message Log</h4>
          {messages?.map((msg, index) => (
            <div key={index}>
              <div
                className={`flex items-center space-x-3 rounded-md ${
                  msg.type === "join"
                    ? "text-green-600"
                    : msg.type === "guess"
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                {msg.text}
              </div>
              <Separator className="my-2 bg-gray-600" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageLog;
