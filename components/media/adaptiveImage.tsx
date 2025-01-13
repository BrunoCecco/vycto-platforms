"use client";
import Image from "next/image";
import { useState } from "react";

interface AdaptiveImageProps {
  src: string;
  alt: string;
  height: number;
  className?: string;
}

export default function AdaptiveImage({
  src,
  alt,
  height,
  className = "",
}: AdaptiveImageProps) {
  const [aspectRatio, setAspectRatio] = useState(16 / 9); // Default aspect ratio

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.target as HTMLImageElement;
    setAspectRatio(img.naturalWidth / img.naturalHeight);
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        height: `${height}px`,
        width: `${height * aspectRatio}px`,
        maxWidth: "100%",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
        onLoad={handleImageLoad}
        sizes={`(max-width: ${height * aspectRatio}px) 100vw, ${height * aspectRatio}px`}
      />
    </div>
  );
}
