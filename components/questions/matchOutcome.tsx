import Image from "next/image";
import { FC } from "react";
import PointsBadge from "../pointsBadge";

const MatchOutcome: FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:w-1/2 md:p-10">
        {/* Points Badge */}
        <PointsBadge points={5} />

        {/* Match Info */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Real Madrid vs Chelsea
          </h2>
          <p className="text-sm text-gray-500">
            Pick the winner to score points
          </p>
        </div>

        {/* Teams */}
        <div className="flex w-full items-center justify-between py-4 md:justify-around md:px-4">
          {/* Real Madrid */}
          <div className="text-center">
            <div className="relative h-24 w-32 overflow-hidden rounded-lg border">
              <Image
                src="/teamBadge.jpg"
                alt="Real Madrid"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="text-sm font-semibold text-gray-700">Real Madrid</p>
            <p className="text-xs text-gray-500">Home</p>
          </div>

          {/* VS */}
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-600">VS</span>
          </div>

          {/* Chelsea */}
          <div className="text-center">
            <div className="relative h-24 w-32 overflow-hidden rounded-lg border">
              <Image
                src="/teamBadge.jpg"
                alt="Chelsea"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="text-sm font-semibold text-gray-700">Chelsea</p>
            <p className="text-xs text-gray-500">Away</p>
          </div>
        </div>

        {/* Draw Button */}
        <div className="flex justify-center">
          <button className="w-24 rounded-full border-2 border-blue-600 bg-white p-2 text-sm font-semibold text-blue-600 hover:bg-blue-50">
            Draw
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchOutcome;
