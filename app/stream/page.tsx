"use client";
import Chatbox from "@/components/chatbox";
import { useRef } from "react";
import Webcam from "react-webcam";

type Props = {};

const WebCam = (props: Props) => {
  const webcamRef = useRef<Webcam>(null);

  return (
    <div className="flex flex-row">
      {/* <Webcam /> */}
      <Chatbox/>
    </div>
  );
};


export default WebCam