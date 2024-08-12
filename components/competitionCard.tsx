import Image from "next/image";
import { FC } from "react";
import BlurImage from "./old-components/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";
import { getCompetitionUsers } from "@/lib/fetchers";
import Link from "next/link";

interface CompetitionCardProps {
  title: string | null;
  sponsor: string | null;
  description: string | null;
  slug: string;
  image: string | null;
  imageBlurhash: string | null;
  createdAt: Date;
  startDate: string;
  endDate: string;
}

const CompetitionCard: FC<CompetitionCardProps> = async ({
  title,
  sponsor,
  description,
  slug,
  image,
  imageBlurhash,
  createdAt,
  startDate,
  endDate,
}) => {
  const users = await getCompetitionUsers(slug);

  let status;
  if (new Date(startDate) > new Date()) {
    const days = Math.ceil(
      (new Date(startDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    status = days + " Days to go";
  } else if (new Date(endDate) < new Date()) {
    status = users.length + " Participants";
  } else {
    status = "Live";
  }

  return (
    <div className="w-80 overflow-hidden rounded-xl border bg-white p-4 shadow-lg">
      <div className="relative h-40 w-full">
        <BlurImage
          alt={title ?? "Card thumbnail"}
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
          src={image ?? "/placeholder.png"}
          placeholder="blur"
          blurDataURL={imageBlurhash ?? placeholderBlurhash}
        />
      </div>

      {/* Title, sponser & profiles bit */}
      <div className="flex items-center justify-between py-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-600">{sponsor}</p>
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
        <p className="text-sm text-green-600">{status}</p>
        <Link href={slug}>Play</Link>
      </div>
    </div>
  );
};

export default CompetitionCard;
