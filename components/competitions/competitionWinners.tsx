"use client";
import Image from "next/image";
import Link from "next/link";
import {
  SelectCompetition,
  SelectSite,
  SelectUserCompetition,
} from "@/lib/schema";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Parser } from "@json2csv/plainjs";

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
      <div className="pr-2 ">{index + 1}</div>
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
        <span className="ml-2 font-bold ">
          {adminView ? user.email : user.username}
        </span>
      </div>
      <div className="py-4 ">{parseFloat(user.points || "0").toFixed(2)}</div>
      <div className="py-4">
        <Link
          href={`${url}/${user.userId}`}
          target="_blank"
          rel="noreferrer"
          className="bg-blue-100 text-purple-800 hover:bg-blue-300 rounded-full p-2 px-4"
        >
          View
        </Link>
      </div>
    </div>
  );
};

type Site = {
  site: {
    subdomain: string | null;
  } | null;
};

export default function CompetitionWinners({
  compData,
  winnerData,
  participants,
  url,
  adminView,
}: {
  compData: SelectCompetition & Site;
  winnerData: any;
  participants: SelectUserCompetition[];
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

  const downloadWinnersCSVFile = () => {
    const data = [
      ["Rank", "Email", "Points", "SubmissionLink"],
      ...rewardWinners.map((user, index) => [
        user.ranking,
        user.email,
        parseFloat(user.points || "0").toFixed(2),
        `${url}/${user.userId}`,
      ]),
      ...reward2Winners.map((user, index) => [
        user.ranking,
        user.email,
        parseFloat(user.points || "0").toFixed(2),
        `${url}/${user.userId}`,
      ]),
      ...reward3Winners.map((user, index) => [
        user.ranking,
        user.email,
        parseFloat(user.points || "0").toFixed(2),
        `${url}/${user.userId}`,
      ]),
    ];
    const parser = new Parser({});
    const csv = parser.parse(data);
    alert(csv);
    const blob = new Blob([csv], { type: "text/csv" });
    const url_ = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url_;
    a.download =
      compData.title + "-winners-" + new Date().toDateString() + ".xlsx";
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllCSVFile = () => {
    const data = [
      ["Rank", "Email", "Points", "SubmissionLink"],
      ...participants.map((user, index) => [
        user.ranking,
        user.email,
        parseFloat(user.points || "0").toFixed(2),
        `${url}/${user.userId}`,
      ]),
    ];
    const parser = new Parser({});
    const csv = parser.parse(data);
    alert(csv);
    const blob = new Blob([csv], { type: "text/csv" });
    const url_ = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url_;
    a.download =
      compData.title + "-participants-" + new Date().toDateString() + ".xlsx";
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex  flex-col space-y-12 p-6">
      <Button onClick={downloadWinnersCSVFile}>Download Winners Excel</Button>
      <Button onClick={downloadAllCSVFile}>
        Download All Participants Excel
      </Button>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
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
        </div>

        <div className="flex flex-col gap-6">
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
        </div>

        <div className="flex flex-col gap-6">
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
    </div>
  );
}
