import React, { useContext, useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SocketContext } from "@/app/socketContext";

interface Message {
  text: string;
  type: "join" | "right" | "wrong" | "leave";
}

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

const MessageLog = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useContext(SocketContext);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ScrollArea className="h-96 w-48 rounded-md border bg-secondary">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Log</h4>
        {messages?.map((msg, index) => (
          <>
            <div
              key={index}
              className={`flex items-center space-x-3 rounded-md ${
                msg.type === "join"
                  ? "text-green-600"
                  : msg.type === "right"
                  ? "text-blue-600"
                  : msg.type == "wrong"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {msg.text}
            </div>
            <Separator className="my-2 bg-black" />
          </>
        ))}
        <div ref={logEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageLog;
