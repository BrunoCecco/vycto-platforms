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
import { head } from "@vercel/blob";

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
  participants: any[];
  url: string;
  adminView: boolean;
}) {
  const [rewardWinners, setRewardWinners] = useState<any[]>([]);
  const [reward2Winners, setReward2Winners] = useState<any[]>([]);
  const [reward3Winners, setReward3Winners] = useState<any[]>([]);

  useEffect(() => {
    const fetchWinners = async () => {
      if (winnerData) {
        setRewardWinners(winnerData.rewardWinners);
        setReward2Winners(winnerData.reward2Winners);
        setReward3Winners(winnerData.reward3Winners);
      }
    };
    fetchWinners();
  }, [winnerData]);

  const downloadCSV = (data: any, fileName: string) => {
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

  const getData = (users: any[]) => {
    alert(users);
    return [
      [
        "Rank",
        "Username",
        "Name",
        "Email",
        "Points",
        "SubmissionLink",
        "Newsletter Consent",
        "Prize Notifications Consent",
        "Fanzone Notifications Consent",
      ],
      ...users.map((user, index) => [
        user.ranking,
        user.username,
        user.name,
        user.email,
        parseFloat(user.points || "0").toFixed(2),
        `${url}/${user.userId}`,
        user.newsletter ? "Yes" : "No",
        user.prizeNotifications ? "Yes" : "No",
        user.fanzoneNotifications ? "Yes" : "No",
      ]),
    ];
  };

  const downloadWinnersCSVFile = () => {
    const data = getData([
      ...rewardWinners,
      ...reward2Winners,
      ...reward3Winners,
    ]);
    downloadCSV(
      data,
      compData.title + "-winners-" + new Date().toDateString() + ".csv",
    );
  };

  const downloadAllCSVFile = () => {
    const data = getData(participants);
    downloadCSV(
      data,
      compData.title + "-participants-" + new Date().toDateString() + ".csv",
    );
  };

  const downloadNewsletterOptinsCSVFile = () => {
    const data = getData(participants.filter((user) => user.newsletter));
    downloadCSV(
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
