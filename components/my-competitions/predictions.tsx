import Image from "next/image";
import { MoveUpRight } from "lucide-react";
import { SelectUserCompetition } from "@/lib/schema";
import {
  getCompetitionData,
  getCompetitionFromId,
  getSiteDataById,
} from "@/lib/fetchers";
import Link from "next/link";
import { getSiteDomain } from "@/lib/utils";

const PredictionCard = async ({
  competition,
}: {
  competition: SelectUserCompetition;
}) => {
  const compData = await getCompetitionFromId(competition.competitionId);

  const siteId = compData?.siteId;

  const siteData = await getSiteDataById(siteId!);

  const url = getSiteDomain(siteData!) + "/comp/" + compData?.slug;

  return (
    <Link
      className="group relative flex w-full items-center gap-4 hover:cursor-pointer"
      rel="noreferrer"
      target="_blank"
      href={url}
    >
      <div className="relative h-28 w-28 overflow-hidden rounded-lg">
        <Image
          src={compData?.image ?? "/placeholder.png"}
          alt="RAPID vs CFR Cluj"
          fill
          objectFit="cover"
        />
      </div>
      <div>
        <h3 className="text-xl font-semibold">{compData?.title}</h3>
        <p className="text-gray-400">
          {new Date(competition.submissionDate).toDateString()}
        </p>
        <p className="text-gray-400">
          {parseFloat(competition.points || "0").toFixed(2)} Points
        </p>
      </div>
      {/* Arrow Icon in the top-right corner */}
      <MoveUpRight
        className="absolute right-2 top-2 h-6 w-6 transform transition-transform duration-300 group-hover:-translate-y-3 group-hover:translate-x-3"
        style={{ color: siteData?.color1 || "darkred" }}
      />
    </Link>
  );
};

const Predictions = async ({
  competitions,
  title,
}: {
  competitions: SelectUserCompetition[];
  title: string;
}) => {
  console.log(competitions.length, title);
  return (
    <div className="w-full">
      <h2 className="flex flex-col justify-between text-4xl font-bold leading-tight sm:flex-row">
        <span className="sm:flex-1">{title}</span>
      </h2>

      {/* Current Predictions Content */}
      <div className="mt-8 w-full space-y-6">
        {competitions.map((competition) => (
          <PredictionCard
            key={competition.competitionId}
            competition={competition}
          />
        ))}
      </div>
    </div>
  );
};

export default Predictions;
