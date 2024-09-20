"use client";
import Image from "next/image";
import Link from "next/link";
import { SelectCompetition, SelectUserCompetition } from "@/lib/schema";
import { useEffect, useState } from "react";

const User = ({
  user,
  index,
  url,
  adminView,
}: {
  user: SelectUserCompetition;
  index: number;
  url: string;
  adminView: boolean;
}) => {
  return (
    <div key={user.userId} className="flex w-full items-center gap-4 border-b">
      <div className="pr-2 text-gray-900">{index + 1}</div>
      <div className="flex items-center py-4">
        <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle">
          <Image
            src={`https://avatar.vercel.sh/${user.username || user.email}`}
            alt="Profile"
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="overflow-hidden rounded-full object-cover"
          />
        </div>
        <span className="ml-2 font-bold text-gray-900">
          {adminView ? user.email : user.username}
        </span>
      </div>
      <div className="py-4 text-gray-900">
        {parseFloat(user.points || "0").toFixed(2)}
      </div>
      <div className="py-4">
        <Link
          href={`${url}/${user.userId}`}
          className="rounded-full bg-blue-100 p-2 px-4 text-purple-800 hover:bg-blue-300"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default function CompetitionWinners({
  winnerData,
  url,
  adminView,
}: {
  winnerData: any;
  url: string;
  adminView: boolean;
}) {
  const [rewardWinners, setRewardWinners] = useState<SelectUserCompetition[]>(
    [],
  );
  const [reward2Winners, setReward2Winners] = useState<SelectUserCompetition[]>(
    [],
  );
  const [reward3Winners, setReward3Winners] = useState<SelectUserCompetition[]>(
    [],
  );

  useEffect(() => {
    if (winnerData?.sortedUsers && winnerData) {
      setRewardWinners(
        winnerData.sortedUsers.slice(0, winnerData.rewardWinners!),
      );
      console.log(winnerData.sortedUsers.slice(0, winnerData.rewardWinners!));
      setReward2Winners(
        winnerData.sortedUsers.slice(
          winnerData.rewardWinners!,
          winnerData.rewardWinners! + winnerData.reward2Winners!,
        ),
      );
      setReward3Winners(
        winnerData.sortedUsers.slice(
          winnerData.rewardWinners! + winnerData.reward2Winners!,
          winnerData.rewardWinners! +
            winnerData.reward2Winners! +
            winnerData.reward3Winners!,
        ),
      );
    }
  }, [winnerData]);

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-6 dark:text-stone-200">
      <div className="flex flex-col space-y-6">
        <div className="font-bold">1st Reward Winners</div>
        {rewardWinners.map((user, index) => (
          <User
            key={user.userId}
            user={user}
            index={index}
            url={url}
            adminView={adminView}
          />
        ))}

        <div className="font-bold">2nd Reward Winners</div>
        {reward2Winners.map((user, index) => (
          <User
            key={user.userId}
            user={user}
            index={index}
            url={url}
            adminView={adminView}
          />
        ))}

        <div className="font-bold">3rd Reward Winners</div>
        {reward3Winners.map((user, index) => (
          <User
            key={user.userId}
            user={user}
            index={index}
            url={url}
            adminView={adminView}
          />
        ))}
      </div>
    </div>
  );
}
