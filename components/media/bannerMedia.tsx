"use client";

import { useEffect, useRef, useState } from "react";
import BlurImage from "./blurImage";
import { placeholderBlurhash } from "@/lib/utils";
import {
  Mic,
  MicOff,
  PlayCircle,
  Speaker,
  SpeakerIcon,
  StopCircle,
  Volume,
  Volume2,
} from "lucide-react";
import { Button } from "@nextui-org/react";

export default function BannerMedia({ src }: { src: string }) {
  const videoFormats = ["mp4", "webm", "mov", "mkv"];
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // State to track mute status
  const [play, setPlay] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaFormat = src.split(".").pop() || "";

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = isMuted; // Set mute status based on state
      if (play) videoElement.play();
      else videoElement.pause();
    }
  }, [src, isMuted, play]); // Run effect when src or isMuted changes

  if (!src || src == undefined) return null;

  return src ? (
    videoFormats.includes(mediaFormat) ? (
      <div className="relative h-full w-full">
        {" "}
        {/* Wrap in a div for positioning */}
        {/* {isLoading && <Loading />} */}
        <video
          ref={videoRef}
          preload="auto"
          loop
          playsInline
          muted
          onLoadedData={() => setIsLoading(false)}
          className="h-full w-full object-cover object-center transition-all duration-100 hover:scale-105"
          onClick={() => setPlay(!play)}
        >
          <source src={src} type={`video/${mediaFormat}`} />
          Your browser does not support the video tag.
        </video>
        <Button
          onClick={() => setIsMuted(!isMuted)} // Toggle mute on button click
          className="absolute right-2 top-2 rounded bg-transparent p-2"
        >
          {isMuted ? <Volume /> : <Volume2 />}{" "}
          {/* Button text based on mute state */}
        </Button>
      </div>
    ) : (
      <BlurImage
        src={src || "/placeholder.png"}
        blurDataURL={"blur"}
        priority
        alt="Banner Image"
        fill
        className="object-cover object-center transition-all duration-100 hover:scale-110"
      />
    )
  ) : null;
}
