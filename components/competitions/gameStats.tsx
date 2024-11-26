import { SelectUser, SelectUserCompetition } from "@/lib/schema";
import { Share } from "lucide-react"; // Importing the icons
import { FC } from "react";

interface GameStatsProps {
  competitionTitle: string;
  userComp: SelectUserCompetition;
  users: SelectUserCompetition[];
  color: string;
}

const GameStats: FC<GameStatsProps> = ({
  competitionTitle,
  userComp,
  users,
  color,
}) => {
  var sortedUsers = users.sort((a: any, b: any) => b.points - a.points);
  const rank =
    sortedUsers.findIndex((user: any) => user.userId === userComp.userId) + 1;
  const percentile = (rank / users.length) * 100;

  return (
    <div className="flex justify-center">
      <div className="flex h-80 w-full flex-col justify-around rounded-lg border-2 bg-white px-6 py-4 shadow-sm">
        {/* Header */}
        <h2 className="text-center text-xl font-semibold text-blue-900">
          Competition: {competitionTitle}
        </h2>

        {/* Username */}
        <p className="text-center text-lg text-black">
          @{userComp.username || "User"}
        </p>

        {/* Submission Info */}
        <div className="flex flex-col items-center justify-center text-center text-gray-600">
          <p className="text-sm">
            Submitted Prediction:{" "}
            {new Date(userComp.submissionDate).toDateString()}
          </p>
          {/* <span className="ml-1" role="img" aria-label="tick">
            ✅
          </span> */}
          {/* <Share className="ml-1 cursor-pointer text-gray-400 hover:text-gray-600" /> */}
        </div>

        {/* Statistics */}
        <div className="flex flex-wrap items-center justify-between text-center text-sm text-gray-600">
          <div className="h-6 border-r" style={{ borderColor: color }} />
          <div>
            <p className="font-semibol pb-2" style={{ color: color }}>
              {parseFloat(userComp.points || "0").toFixed(2)} / 100
            </p>
            <p className="text-xs">total points</p>
          </div>
          <div className="h-6 border-r" style={{ borderColor: color }} />
          <div>
            <p className="font-semibol pb-2" style={{ color: color }}>
              {percentile}
            </p>
            <p className="text-xs">percentile</p>
          </div>
          <div className="h-6 border-r " style={{ borderColor: color }} />
          <div>
            <p className="pb-2 font-semibold" style={{ color: color }}>
              {rank}/{users.length}
            </p>
            <p className="text-xs">rank</p>
          </div>
          <div className="h-6 border-r " style={{ borderColor: color }} />
          {/* <div>
            <p className="pb-2 font-semibold text-green-600">
              {bonusPoints} pt
            </p>
            <p className="text-xs">
              bonus{" "}
              <span role="img" aria-label="fire">
                🔥
              </span>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default GameStats;
