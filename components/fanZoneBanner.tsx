import Image from "next/image";
import { FC } from "react";

interface FanZoneBannerProps {
  logoPlaySrc: string;
  bannerSrc: string;
}

const FanZoneBanner: FC<FanZoneBannerProps> = ({ logoPlaySrc, bannerSrc }) => {
  return (
    <div className="relative">
      {/* Cablenet Play Section */}
      <div className="relative mx-auto h-16 w-48">
        <Image
          src={logoPlaySrc}
          alt="Cablenet Play"
          layout="fill"
          objectFit="contain"
        />
      </div>

      {/* Players and Text Banner Section */}
      <div className="relative mx-auto h-32 w-full">
        <Image
          src={bannerSrc}
          alt="Players Banner"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </div>
  );
};

export default FanZoneBanner;
