import Image from "next/image";
import { FC } from "react";

interface CompetitionCardProps {
  imageSrc: string;
  title: string;
  sponsor: string;
  timeLeft: string;
  playButtonText: string;
}

const CompetitionCard: FC<CompetitionCardProps> = ({
  imageSrc,
  title,
  sponsor,
  timeLeft,
}) => {
  return (
    <div className="w-80 overflow-hidden rounded-xl border bg-white p-4 shadow-lg">
      <div className="relative h-40 w-full">
        <Image
          src={imageSrc}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
        />
      </div>

      {/* Title, sponser & profiles bit */}
      <div className="flex items-center justify-between py-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-600">{sponsor}</p>
        </div>
        <div className="relative flex items-center">
          <div className="relative h-6 w-6">
            <Image
              src={"/atletiPast.jpg"}
              alt="Profile 1"
              layout="fill"
              objectFit="cover"
              className="rounded-full border-2 border-white"
            />
          </div>
          <div className="relative -ml-2 h-6 w-6">
            <Image
              src={"/atletiPast.jpg"}
              alt="Profile 2"
              layout="fill"
              objectFit="cover"
              className="rounded-full border-2 border-white"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-green-600">{timeLeft}</p>
        <button className="w-24 rounded-full bg-green-700 p-2 text-white hover:bg-green-600">
          Play
        </button>
      </div>
    </div>
  );
};

export default CompetitionCard;
