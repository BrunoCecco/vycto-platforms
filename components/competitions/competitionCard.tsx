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
import { Card, CardFooter, CardHeader } from "@nextui-org/react";

const COMPETITION_WINDOW = 5;

const CompetitionCard = ({
  competition,
  siteData,
  type,
  played = false,
  onClick = () => {},
}: {
  competition: SelectCompetition;
  siteData: SelectSite;
  type?: "current" | "past";
  played?: boolean;
  onClick?: () => void; // Define onClick type
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
          "Opens in " +
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
      containerClassName="group h-[350px] w-[300px] relative rounded-xl overflow-hidden"
      className="hover: relative h-full w-full transition-all duration-400"
      color={siteData.color1}
    >
      <Card
        isFooterBlurred
        radius="md"
        className="h-full w-full rounded-xl border-none"
      >
        <BlurImage
          alt={competition.title || "Card thumbnail"}
          className="h-full w-full rounded-xl object-cover transition-all duration-100 group-hover:scale-110"
          src={competition.image || "/placeholder.png"}
          placeholder="blur"
          fill
          blurDataURL={competition.imageBlurhash || placeholderBlurhash}
        />
        <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large bg-background/60 py-1 shadow-small before:rounded-xl">
          <div className="flex w-full flex-col gap-1">
            <h2 className="font-semibold">
              {competition.title || "Competition by " + competition.sponsor}
            </h2>
            <p
              className={`text-sm font-bold`}
              style={{ color: siteData.color2 }}
            >
              {status}
            </p>
          </div>
          {compOpen ? (
            <PlayButton
              color1={siteData.color1}
              color2={siteData.color2}
              onClick={onClick}
            >
              {played ? "View" : type === "current" ? "Play" : "View"}
            </PlayButton>
          ) : null}
        </CardFooter>
      </Card>
    </HoverBorderGradient>
  );
};

export default CompetitionCard;
