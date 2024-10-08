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

const CompetitionCard = ({
  competition,
  siteData,
  type,
}: {
  competition: SelectCompetition;
  siteData: SelectSite;
  type?: "current" | "past";
}) => {
  const [users, setUsers] = useState<any[]>();
  const [status, setStatus] = useState<string>();

  useEffect(() => {
    const fetchUsers = async () => {
      const usrs = await getCompetitionUsers(competition.slug);
      setUsers(usrs);

      if (new Date(competition.date) > new Date()) {
        const days = Math.ceil(
          (new Date(competition.date).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        );
        setStatus(days + " Days to go");
      } else if (new Date(competition.date) < new Date()) {
        setStatus(usrs?.length + " Participants");
      } else {
        setStatus("Live");
      }
    };
    fetchUsers();
  }, [competition]);

  return (
    <BackgroundGradient className="group h-full w-[300px] rounded-lg">
      <div className="h-full w-full rounded-lg bg-slate-800 p-2 text-white transition-all duration-200">
        <div className="relative h-48 w-full">
          <div className="h-full w-full overflow-hidden rounded-t-lg">
            <BlurImage
              alt={competition.title ?? "Card thumbnail"}
              fill
              className="rounded-t-lg object-cover transition-all duration-100 hover:scale-110"
              src={competition.image ?? "/placeholder.png"}
              placeholder="blur"
              blurDataURL={competition.imageBlurhash ?? placeholderBlurhash}
            />
          </div>
        </div>

        <div className="flex h-28 flex-col justify-between px-1 pb-1 pt-2 text-left">
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
                  src={`https://avatar.vercel.sh/1`}
                  alt="Profile 1"
                  fill
                  className="rounded-full border-2 border-white object-cover"
                />
              </div>
              <div className="relative -ml-2 h-6 w-6">
                <Image
                  src={`https://avatar.vercel.sh/99`}
                  alt="Profile 2"
                  fill
                  className="rounded-full border-2 border-white object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: siteData.color2 }}>
              {status}
            </p>
            <CompetitionModal
              type={type!}
              siteData={siteData}
              competition={competition}
              status={status}
              users={users}
            />
          </div>
        </div>
      </div>
    </BackgroundGradient>
  );
};

export default CompetitionCard;
