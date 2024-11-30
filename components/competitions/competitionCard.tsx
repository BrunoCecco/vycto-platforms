"use client";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import BlurImage from "@/components/media/blurImage";
import { placeholderBlurhash, random } from "@/lib/utils";
import { getCompetitionUsers, getSiteData } from "@/lib/fetchers";
import Link from "next/link";
import { SelectCompetition, SelectSite } from "@/lib/schema";
import MovingBorder from "../ui/movingBorder";
import PlayButton from "../buttons/playButton";
import { BackgroundGradient } from "../ui/backgroundGradient";
import CompetitionModal from "./competitionModal";
import HoverBorderGradient from "../ui/hoverBorderGradient";

const COMPETITION_WINDOW = 5;

const CompetitionCard = ({
  competition,
  siteData,
  type,
  onClick, // Accept onClick prop
}: {
  competition: SelectCompetition;
  siteData: SelectSite;
  type?: "current" | "past";
  onClick: () => void; // Define onClick type
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [status, setStatus] = useState<string>();
  const [compOpen, setCompOpen] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const usrs = await getCompetitionUsers(competition.id);
      console.log(usrs);
      setUsers(usrs);

      const days = Math.ceil(
        (new Date(competition.date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (days > COMPETITION_WINDOW) {
        setCompOpen(false);
        setStatus(
          "Opening in " +
            (days - COMPETITION_WINDOW) +
            " day" +
            (days - COMPETITION_WINDOW > 1 ? "s" : ""),
        );
      } else if (days > 0) {
        setCompOpen(true);
        setStatus(calculateTimeLeft());
      } else if (new Date(competition.date) < new Date()) {
        setStatus(usrs?.length + " Participants");
      } else {
        setStatus("Live");
      }
    };
    fetchUsers();
  }, [competition]);

  const calculateTimeLeft = () => {
    const now = new Date();
    const competitionDate = new Date(competition.date);
    const timeDiff = competitionDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysLeft <= 1 && timeDiff > 0) {
      const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutesLeft = Math.floor(
        (timeDiff % (1000 * 60 * 60)) / (1000 * 60),
      );
      return `${hoursLeft}h ${minutesLeft}m left`;
    }
    return daysLeft > 0
      ? `${daysLeft} Days to go`
      : `${Math.abs(daysLeft)} Days ago`;
  };

  return (
    <HoverBorderGradient
      containerClassName="group h-full w-[300px] rounded-xl"
      className="duration-400 h-full w-full transition-all hover:bg-slate-900"
      color={siteData.color1}
    >
      {/* Add onClick here */}
      <div className="h-full w-full rounded-md text-white transition-all duration-200">
        <div className="relative h-48 w-full">
          <div className="h-full w-full overflow-hidden rounded-t-lg">
            <BlurImage
              alt={competition.title || "Card thumbnail"}
              fill
              className="rounded-t-md object-cover transition-all duration-100 group-hover:scale-110"
              src={competition.image || "/placeholder.png"}
              placeholder="blur"
              blurDataURL={competition.imageBlurhash || placeholderBlurhash}
            />
          </div>
        </div>

        <div className="flex h-28 flex-col justify-between p-2 px-4 text-left">
          {/* Title, sponser & profiles bit */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                {competition.title || "Competition by " + competition.sponsor}
              </h2>
            </div>
            <div className="relative flex items-center">
              <div className="relative h-6 w-6">
                <Image
                  src={users[0]?.image || `https://avatar.vercel.sh/99`}
                  alt="Profile 1"
                  fill
                  className="rounded-full border-2 border-white object-cover"
                />
              </div>
              <div className="relative -ml-2 h-6 w-6">
                <Image
                  src={users[1]?.image || `https://avatar.vercel.sh/100`}
                  alt="Profile 2"
                  fill
                  className="rounded-full border-2 border-white object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p
              className={`text-sm text-slate-200`}
              style={{ color: compOpen ? siteData.color1 : "" }}
            >
              {status}
            </p>
            <PlayButton
              color1={siteData.color1}
              color2={siteData.color2}
              onClick={onClick}
              className={`${compOpen ? "visible" : "invisible"}`}
            >
              {type === "current" ? "Play" : "View"}
            </PlayButton>
          </div>
        </div>
      </div>
    </HoverBorderGradient>
  );
};

export default CompetitionCard;
