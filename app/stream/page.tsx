"use client";
import Chatbox from "@/components/chatbox";
import { socket } from "@/socket";
import { useEffect, useRef, useState } from "react";

type Props = {};

const WebCam = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // make socket connection
    socket.connect();
    console.log("connected successfully");

    // cleanup by disconnecting
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // function to access the user's webcam and set up the video stream
    const getLocalStream = async () => {
      try {
        // request access to the user's webcam using getUserMedia
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setLocalStream(stream);
        // assign the stream as the source of the video element
        videoRef.current!.srcObject = stream;
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };
    // call this function on component mount
    getLocalStream();
  }, []);

  const captureFrame = () => {
    if (!videoRef.current) return;
    // create a canvas element to capture the video frame
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // draw the current video frame onto the canva
    context!.drawImage(videoRef.current!, 0, 0);

    // convert canvas content to base64 data
    const dataURL = canvas.toDataURL("video/webm", 0.5); // adjust quality as needed (0.0 to 1.0)

    // emit data backet to flask websocket
    socket.emit("video_frame", { data: dataURL });
  };

  useEffect(() => {
    const fps = 1;
    // send frames from webcam to server
    const intervalId = setInterval(captureFrame, 1000 / fps);
    return () => clearInterval(intervalId);
  }, [localStream]);

  return (
    <div className="flex flex-row">
      <div className="w-[400px]">
        <video ref={videoRef} autoPlay muted />
      </div>
      <Chatbox socket={socket} />
    </div>
  );
};

export default WebCam;
