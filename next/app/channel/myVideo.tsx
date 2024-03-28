"use client";
import { useEffect, useRef, forwardRef } from "react";

type MyVideoProps = {
  myName: string;
};

const MyVideo = forwardRef<HTMLElement, MyVideoProps>((myName, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const meshCanvasRef = useRef<HTMLCanvasElement>(null);
  const requestAnimationFrameRef = useRef<number>(0);
  const CANVAS_SIZE = { width: 300, height: 200 };

  useEffect(() => {
    (async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: CANVAS_SIZE.width,
          height: CANVAS_SIZE.height,
        },
      });
      videoRef.current!.srcObject = new MediaStream(
        mediaStream.getVideoTracks()
      );
    })();
    return () => cancelAnimationFrame(requestAnimationFrameRef.current);
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        src=""
        className="w-full aspect-w-16 aspect-h-9"
      />
    </>
  );
});

export default MyVideo;
