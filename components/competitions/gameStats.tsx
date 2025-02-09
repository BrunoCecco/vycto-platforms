import { SelectUser, SelectUserCompetition } from "@/lib/schema";
import { getLeaderboardName, makeTransparent } from "@/lib/utils";
import { Share } from "lucide-react"; // Importing the icons
import { FC } from "react";

interface GameStatsProps {
  competitionTitle: string;
  userComp: SelectUserCompetition;
  users: SelectUserCompetition[];
  color: string;
  compFinished: boolean;
  totalPoints?: number;
}

const GameStats: FC<GameStatsProps> = ({
  competitionTitle,
  userComp,
  users,
  color,
  compFinished,
  totalPoints,
}) => {
  var sortedUsers = users.sort((a: any, b: any) => b.points - a.points);
  const rank =
    sortedUsers.findIndex((user: any) => user.userId === userComp.userId) + 1;
  const percentileNum = (rank / users.length) * 100;
  const percentile = percentileNum.toFixed(2) + "%";

  return (
    <div
      className="flex justify-center overflow-hidden rounded-lg"
      style={{ backgroundColor: makeTransparent(color, 0.6) }}
    >
      <div className="flex w-full flex-col justify-around gap-4 px-6 py-4 shadow-sm sm:gap-12">
        {/* Header */}
        <h2 className="text-center text-xl font-semibold ">
          Competition: {competitionTitle}
        </h2>

        {/* Username */}
        <p className="text-center text-lg ">@{getLeaderboardName(userComp)}</p>

        {/* Submission Info */}
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-sm">
            Submitted Prediction:{" "}
            {
              // format dd-mm, hh:mm
              new Date(
                userComp.submissionDate.replace(/\[.*\]$/, ""),
              ).toLocaleString("UTC", {
                day: "numeric",
                month: "numeric",
                hour: "numeric",
                minute: "numeric",
              })
            }
          </p>
          {/* <span className="ml-1" role="img" aria-label="tick">
            ✅
          </span> */}
          {/* <Share className="ml-1 cursor-pointer  hover:" /> */}
        </div>

        {/* Statistics */}
        {compFinished ? (
          <div className="grid grid-cols-1 items-center justify-center gap-4 text-center text-sm sm:grid-cols-3">
            <div className="rounded-md bg-background p-2">
              <p className="font-semibol pb-2" style={{ color: color }}>
                {parseFloat(userComp.points || "0").toFixed(2)}{" "}
                {totalPoints ? "/ " + totalPoints : ""}
              </p>
              <p className="text-xs">total points</p>
            </div>
            <div className="rounded-md bg-background p-2">
              <p className="font-semibol pb-2" style={{ color: color }}>
                {percentile}
              </p>
              <p className="text-xs">percentile</p>
            </div>
            <div className="rounded-md bg-background p-2">
              <p className="pb-2 font-semibold" style={{ color: color }}>
                {rank}/{users.length}
              </p>
              <p className="text-xs">rank</p>
            </div>
            {/* <div>
            <p className="pb-2 font-semibold text-success-600">
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
        ) : null}
      </div>
    </div>
  );
};

export default GameStats;
