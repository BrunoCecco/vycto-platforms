import BlurImage from "./blurImage";
import { placeholderBlurhash } from "@/lib/utils";

export default function BannerMedia({ src }: { src: string }) {
  const videoFormats = ["mp4", "webm", "mov", "mkv"];

  const mediaFormat = src.split(".").pop() ?? "";

  return src ? (
    videoFormats.includes(mediaFormat) ? (
      <video
        autoPlay
        preload="none"
        loop
        muted
        playsInline
        className="h-full w-full object-cover object-center"
      >
        <source src={src} type={`video/${mediaFormat}`} />
        Your browser does not support the video tag.
      </video>
    ) : (
      <BlurImage
        src={src ?? "/placeholder.png"}
        blurDataURL={placeholderBlurhash}
        unoptimized
        alt="Banner Image"
        fill
        className="object-cover object-center"
      />
    )
  ) : null;
}
