import { Share } from "lucide-react"; // Importing the icons
import { FC } from "react";

interface GameStatsProps {
  competitionTitle: string;
  username: string;
  submissionDate: string;
  submissionTime: string;
  totalPoints: number;
  percentile: string;
  rank: string;
  bonusPoints: number;
}

const GameStats: FC<GameStatsProps> = ({
  competitionTitle,
  username,
  submissionDate,
  submissionTime,
  totalPoints,
  percentile,
  rank,
  bonusPoints,
}) => {
  return (
    <div className="flex justify-center">
      <div className="flex h-80 w-full flex-col justify-around rounded-lg border-2 bg-white px-6 py-4 shadow-sm">
        {/* Header */}
        <h2 className="text-center text-xl font-semibold text-blue-900">
          Competition: {competitionTitle}
        </h2>

        {/* Username */}
        <p className="text-center text-lg text-black">@{username}</p>

        {/* Submission Info */}
        <div className="flex flex-col items-center justify-center text-center text-gray-600">
          <p className="text-sm">
            Submitted Prediction: {submissionDate} – {submissionTime}
          </p>
          {/* <span className="ml-1" role="img" aria-label="tick">
            ✅
          </span> */}
          {/* <Share className="ml-1 cursor-pointer text-gray-400 hover:text-gray-600" /> */}
        </div>

        {/* Statistics */}
        <div className="flex flex-wrap items-center justify-between text-center text-sm text-gray-600">
          <div>
            <p className="pb-2 font-semibold text-green-600">
              {totalPoints} / 100
            </p>
            <p className="text-xs">total points</p>
          </div>
          <div className="h-6 border-r border-green-600" />
          <div>
            <p className="pb-2 font-semibold text-green-600">{percentile}</p>
            <p className="text-xs">percentile</p>
          </div>
          <div className="h-6 border-r border-green-600" />
          <div>
            <p className="pb-2 font-semibold text-green-600">{rank}</p>
            <p className="text-xs">rank</p>
          </div>
          <div className="h-6 border-r border-green-600" />
          <div>
            <p className="pb-2 font-semibold text-green-600">
              {bonusPoints} pt
            </p>
            <p className="text-xs">
              bonus{" "}
              <span role="img" aria-label="fire">
                🔥
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
