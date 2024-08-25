import Image from "next/image";
import { FC } from "react";
import BlurImage from "./old-components/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";
import { getCompetitionUsers, getSiteData } from "@/lib/fetchers";
import Link from "next/link";
import { SelectCompetition } from "@/lib/schema";

const CompetitionCard = async ({
  competition,
}: {
  competition: SelectCompetition;
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
    <div className="overflow-hidden rounded-xl border bg-white p-4 shadow-lg">
      <div className="relative h-40 w-full">
        <BlurImage
          alt={competition.title ?? "Card thumbnail"}
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
          src={competition.image ?? "/placeholder.png"}
          placeholder="blur"
          blurDataURL={competition.imageBlurhash ?? placeholderBlurhash}
        />
      </div>

      {/* Title, sponser & profiles bit */}
      <div className="flex items-center justify-between py-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {competition.title}
          </h2>
          <p className="text-sm text-gray-600">{competition.sponsor}</p>
        </div>
        <div className="relative flex items-center">
          <div className="relative h-6 w-6">
            <Image
              src={"/atletiPast.jpg"}
              alt="Profile 1"
              layout="fill"
              objectFit="cover"
              className="rounded-full border-2 border-white"
            />
          </div>
          <div className="relative -ml-2 h-6 w-6">
            <Image
              src={"/atletiPast.jpg"}
              alt="Profile 2"
              layout="fill"
              objectFit="cover"
              className="rounded-full border-2 border-white"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: competition.color2 }}>
          {status}
        </p>
        <Link
          href={competition.slug}
          className="w-24 rounded-full  p-2 text-center text-white"
          style={{ backgroundColor: competition.color2 }}
        >
          Play
        </Link>
      </div>
    </div>
  );
};

export default CompetitionCard;
