"use client";
import { checkEnvironment } from "@/utils/base_url";
import { ChangeEvent, useState, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";

type Props = {};
type Message = {
  data: string;
  count: number;
};

const Chatbox: React.FC = (props: Props) => {
  // to make sure that new connection is not made on rerender
  const socketRef = useRef<Socket | null>(null);

  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socketRef.current = io(checkEnvironment());

    // make socket connection
    socketRef.current.on("connect", () => {
      socketRef.current?.emit("my_event", { data: "I'm connected!" });
      console.log("connected");
    });

    // listen for messages
    socketRef.current.on("my_response", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // cleanup by disconnecting
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socketRef.current?.emit("my_event", { data: currentMessage });
    // Clear the currentMessage state
    setCurrentMessage("");
  };

  return (
    <div>
      {/* Display the messages */}
      {messages.map((message, index) => (
        <p key={index}>{message.data}</p>
      ))}
      <input
        type="text"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setCurrentMessage(e.target.value)
        }
        value={currentMessage}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatbox;
