import Image from "next/image";
import { FC } from "react";
import BlurImage from "@/components/images/blurImage";
import { placeholderBlurhash, random } from "@/lib/utils";
import { getCompetitionUsers, getSiteData } from "@/lib/fetchers";
import Link from "next/link";
import { SelectCompetition, SelectSite } from "@/lib/schema";

const CompetitionCard = async ({
  competition,
  siteData,
}: {
  competition: SelectCompetition;
  siteData: SelectSite;
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
    <div className="rounded-lg border border-stone-200 bg-white shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      <div className="relative h-40 w-full">
        <BlurImage
          alt={competition.title ?? "Card thumbnail"}
          layout="fill"
          className="rounded-t-lg object-cover"
          src={competition.image ?? "/placeholder.png"}
          placeholder="blur"
          blurDataURL={competition.imageBlurhash ?? placeholderBlurhash}
        />
      </div>

      <div className="px-4 pb-4 pt-2">
        {/* Title, sponser & profiles bit */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {competition.title}
            </h2>
            <p className="text-sm text-gray-600">{competition.sponsor}</p>
          </div>
          <div className="relative flex items-center">
            <div className="relative h-6 w-6">
              <Image
                src={`https://avatar.vercel.sh/1`}
                alt="Profile 1"
                layout="fill"
                className="rounded-full border-2 border-white object-cover"
              />
            </div>
            <div className="relative -ml-2 h-6 w-6">
              <Image
                src={`https://avatar.vercel.sh/99`}
                alt="Profile 2"
                layout="fill"
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
            className="w-24 rounded-full  p-2 text-center text-white hover:opacity-75"
            style={{ backgroundColor: siteData.color2 }}
          >
            Play
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompetitionCard;
