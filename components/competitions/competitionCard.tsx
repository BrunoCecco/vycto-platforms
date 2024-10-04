"use client";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import BlurImage from "@/components/media/blurImage";
import { placeholderBlurhash, random } from "@/lib/utils";
import { getCompetitionUsers, getSiteData } from "@/lib/fetchers";
import Link from "next/link";
import { SelectCompetition, SelectSite } from "@/lib/schema";
import MovingBorder from "../movingBorder";

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
  const [hovered, setHovered] = useState(false);

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
    <div className="group h-full w-full rounded-lg bg-slate-200 shadow-lg shadow-black transition-all duration-200 hover:bg-slate-100 hover:shadow-xl">
      <MovingBorder
        color1={siteData.color1}
        color2={siteData.color2}
        className="invisible group-hover:visible"
      >
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
              <h2 className="font-semibold text-gray-800">
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
            <Link
              href={"/comp/" + competition.slug}
              className="w-24 rounded-xl p-2 text-center text-white transition-all duration-200 hover:scale-105"
              onMouseOver={() => setHovered(true)}
              onMouseOut={() => setHovered(false)}
              style={{
                backgroundColor:
                  !hovered && type === "past" ? "gray" : siteData.color2,
                backgroundImage:
                  type === "current" && !hovered
                    ? `linear-gradient(45deg, ${siteData.color1}, ${siteData.color2})`
                    : "none",
              }}
            >
              {type === "current" ? "Play" : "View"}
            </Link>
          </div>
        </div>
      </MovingBorder>
    </div>
  );
};

export default CompetitionCard;
