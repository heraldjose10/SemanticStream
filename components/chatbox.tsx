"use client";
import { ChangeEvent, useState, useEffect } from "react";
import { Socket } from "socket.io-client";

type Props = {
  socket: Socket;
};

type Message = {
  data: string;
  count: number;
};

const Chatbox: React.FC<Props> = ({ socket }) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    function onResponse(message: Message) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }
    // listen for messages
    socket.on("my_response", onResponse);

    return () => {
      socket.off("my_response", onResponse);
    };
  });

  const sendMessage = () => {
    socket.emit("my_event", { data: currentMessage });
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
