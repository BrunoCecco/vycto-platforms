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
    <div
      key={user.userId}
      className="flex w-full flex-col items-center gap-2 rounded-lg border-b bg-content3 p-2 shadow-md"
    >
      <div className="pr-2 ">Overall rank: {user.ranking}</div>
      <div className="flex items-center">
        <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle">
          <Image
            src={`https://avatar.vercel.sh/${user.username || user.email}`}
            alt="Profile"
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="overflow-hidden rounded-full object-cover"
          />
        </div>
        <span className="ml-2 break-all font-bold">
          {adminView ? user.email : user.username}
        </span>
      </div>
      <div className="">{parseFloat(user.points || "0").toFixed(2)}</div>
      <div className="">
        <Link
          href={`${url}/${user.userId}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-content4 p-2 px-4 hover:bg-content3"
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
    console.log(winnerData);
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

  const downloadExcel = (data: any, fileName: string) => {
    const parser = new Parser({});
    const csv = parser.parse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url_ = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url_;
    a.download = fileName;
    a.click();
    document.body.removeChild(a);
  };

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
    downloadExcel(
      data,
      compData.title + "-winners-" + new Date().toDateString() + ".csv",
    );
  };

  const downloadAllCSVFile = () => {
    const data = [
      ["Rank", "Email", "Points", "SubmissionLink"],
      ...participants
        .sort((a, b) => a.ranking! - b.ranking!)
        .map((user) => [
          user.ranking,
          user.email,
          parseFloat(user.points || "0").toFixed(2),
          `${url}/${user.userId}`,
        ]),
    ];
    downloadExcel(
      data,
      compData.title + "-participants-" + new Date().toDateString() + ".csv",
    );
  };

  const downloadNewsletterOptinsCSVFile = () => {
    const data = [
      ["Rank", "Email", "Points", "SubmissionLink"],
      ...participants
        .filter((p) => p.newsletter == true)
        .sort((a, b) => a.ranking! - b.ranking!)
        .map((user, index) => [
          user.ranking,
          user.email,
          parseFloat(user.points || "0").toFixed(2),
          `${url}/${user.userId}`,
        ]),
    ];
    downloadExcel(
      data,
      compData.title +
        "-newsletter-optins-" +
        new Date().toDateString() +
        ".csv",
    );
  };

  return (
    <div className="flex flex-col space-y-12 p-2 sm:p-6">
      <div className="flex flex-col gap-2">
        <Button onClick={downloadAllCSVFile}>Download All Participants</Button>
        <Button onClick={downloadWinnersCSVFile}>
          Download Reward Winners
        </Button>
        <Button onClick={downloadNewsletterOptinsCSVFile}>
          Download Newsletter Opt Ins
        </Button>
      </div>
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
