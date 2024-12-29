"use client";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";
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
import { CoolMode } from "../ui/coolMode";

const COMPETITION_WINDOW = 5;

const CompetitionCard = ({
  competition,
  siteData,
  type,
  played = false,
  onClick,
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

  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (titleRef.current && containerRef.current) {
      const titleWidth = titleRef.current.scrollWidth;
      const containerWidth = containerRef.current.offsetWidth;

      setScrollWidth(titleWidth);
      setContainerWidth(containerWidth);
      setShouldScroll(titleWidth > containerWidth);
    }
  }, [competition.title]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usrs = await getCompetitionUsers(competition.id);
      setUsers(usrs);

      const days = Math.ceil(
        (new Date(competition.date.replace(/\[.*\]$/, "")).getTime() -
          new Date().getTime()) /
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
      } else if (
        new Date(competition.date.replace(/\[.*\]$/, "")) < new Date()
      ) {
        setStatus(usrs?.length + " Participants");
      } else {
        setStatus("Live");
      }
    };
    fetchUsers();
  }, [competition]);

  const calculateTimeLeft = () => {
    const now = new Date();
    const competitionDate = new Date(competition.date.replace(/\[.*\]$/, ""));
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
      containerClassName="group sm:h-[350px] sm:w-[300px] h-[275px] w-[240px] relative rounded-xl overflow-hidden"
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
        <CardFooter className="absolute bottom-1 z-10 ml-[4px] w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large bg-black/60 px-2 py-1 text-white shadow-small before:rounded-xl">
          <div className="flex w-full items-center gap-2">
            {/* Scrolling text */}
            <div className="flex w-2/3 flex-col" ref={containerRef}>
              <h2
                className="text-sm font-semibold sm:text-sm"
                ref={titleRef}
                // style={{
                //   animation: shouldScroll
                //     ? `scroll-title 5s ease-in-out infinite alternate`
                //     : "none",
                //   display: "inline-block",
                // }}
              >
                {competition.title || "Competition by " + competition.sponsor}
              </h2>

              <p
                className={`mt-1 text-xs font-bold sm:text-sm`}
                style={{ color: siteData.color2 }}
              >
                {status}
              </p>
            </div>

            {/* Play button */}
            {/* <div className="flex w-1/2 justify-end"> */}
            {onClick ? (
              compOpen ? (
                <PlayButton
                  color1={siteData.color1}
                  color2={siteData.color2}
                  onClick={onClick}
                >
                  {played ? "View" : type === "current" ? "Play" : "View"}
                </PlayButton>
              ) : null
            ) : (
              <PlayButton color1={siteData.color1} color2={siteData.color2}>
                <CoolMode options={{ color: siteData.color1 }}>
                  <div>Play</div>
                </CoolMode>
              </PlayButton>
            )}
          </div>
          <style jsx>{`
            @keyframes scroll-title {
              0% {
                transform: translateX(8px);
              }
              100% {
                transform: translateX(-${scrollWidth - containerWidth}px);
              }
            }
          `}</style>
          {/* </div> */}
        </CardFooter>
      </Card>
    </HoverBorderGradient>
  );
};

export default CompetitionCard;
