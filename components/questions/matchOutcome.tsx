import { useState, FC } from "react";
import Image from "next/image";
import PointsBadge from "../pointsBadge";

// Define the types for the props
interface Team {
  name: string;
  image: string;
  position: string;
}

interface MatchOutcomeProps {
  question: string;
  points: number;
  homeTeam: Team;
  awayTeam: Team;
}

const MatchOutcome: FC<MatchOutcomeProps> = ({
  question,
  points,
  homeTeam,
  awayTeam,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:w-1/2 md:p-10">
        {/* Points Badge */}
        <PointsBadge points={points} />

        {/* Match Info */}
        <h2 className="text-lg font-semibold text-gray-800 md:text-xl">
          {question}
        </h2>
        <p className="text-sm text-gray-500">Pick the winner to score points</p>

        {/* Teams */}
        <div className="flex w-full items-center justify-between py-4 md:justify-around md:px-4">
          {/* Home Team */}
          <div
            className={`cursor-pointer text-center ${
              selectedOutcome === homeTeam.name ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => setSelectedOutcome(homeTeam.name)}
          >
            <div className="relative h-20 w-24 overflow-hidden rounded-lg border md:h-24 md:w-32">
              <Image
                src={homeTeam.image}
                alt={homeTeam.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {homeTeam.name}
            </p>
            <p className="text-xs text-gray-500">{homeTeam.position}</p>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="rounded-full border-2 border-blue-600 p-2 text-sm font-bold italic text-blue-600 md:text-xl">
              VS
            </div>
          </div>

          {/* Away Team */}
          <div
            className={`cursor-pointer text-center ${
              selectedOutcome === awayTeam.name ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => setSelectedOutcome(awayTeam.name)}
          >
            <div className="relative h-20 w-24 overflow-hidden rounded-lg border md:h-24 md:w-32">
              <Image
                src={awayTeam.image}
                alt={awayTeam.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {awayTeam.name}
            </p>
            <p className="text-xs text-gray-500">{awayTeam.position}</p>
          </div>
        </div>

        {/* Draw Button */}
        <div className="flex justify-center">
          <button
            className={`w-24 rounded-full border-2 border-blue-600 bg-white p-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 ${
              selectedOutcome === "Draw" ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => setSelectedOutcome("Draw")}
          >
            Draw
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchOutcome;
