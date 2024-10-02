import Image from "next/image";
import { FC } from "react";
import BlurImage from "@/components/media/blurImage";
import { placeholderBlurhash, random } from "@/lib/utils";
import { getCompetitionUsers, getSiteData } from "@/lib/fetchers";
import Link from "next/link";
import { SelectCompetition, SelectSite } from "@/lib/schema";
import MovingBorder from "../movingBorder";

const CompetitionCard = async ({
  competition,
  siteData,
  type,
}: {
  competition: SelectCompetition;
  siteData: SelectSite;
  type?: "current" | "past";
}) => {
  const users = await getCompetitionUsers(competition.slug);

  let status;
  if (new Date(competition.date) > new Date()) {
    const days = Math.ceil(
      (new Date(competition.date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    status = days + " Days to go";
  } else if (new Date(competition.date) < new Date()) {
    status = users.length + " Participants";
  } else {
    status = "Live";
  }

  return (
    <div className="h-full w-full overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl">
      <MovingBorder color1={siteData.color1} color2={siteData.color2}>
        <div className="relative h-48 w-full">
          <BlurImage
            alt={competition.title ?? "Card thumbnail"}
            fill
            className="rounded-t-lg object-cover"
            src={competition.image ?? "/placeholder.png"}
            placeholder="blur"
            blurDataURL={competition.imageBlurhash ?? placeholderBlurhash}
          />
        </div>

        <div className="flex h-32 flex-col justify-between px-4 pb-4 pt-2 text-left">
          {/* Title, sponser & profiles bit */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">
                {competition.title || "Competition by " + competition.sponsor}
              </h2>
              <p className="text-sm text-gray-600">{competition.sponsor}</p>
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
              className="w-24 rounded-full  p-2 text-center text-white transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: type === "past" ? "gray" : siteData.color2,
                backgroundImage:
                  type === "current"
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
