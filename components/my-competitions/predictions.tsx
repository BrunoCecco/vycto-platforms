import Image from "next/image";
import { MoveUpRight } from "lucide-react";
import { SelectSite, SelectUserCompetition } from "@/lib/schema";
import {
  getCompetitionData,
  getCompetitionFromId,
  getQuestionsForCompetition,
  getSiteDataById,
} from "@/lib/fetchers";
import Link from "next/link";
import { getSiteDomain } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Carousel } from "../ui/carousel";
import BlurImage from "@/components/media/blurImage";
import { placeholderBlurhash, random } from "@/lib/utils";
import PlayButton from "../buttons/playButton";
import HoverBorderGradient from "../ui/hoverBorderGradient";
import { Card, CardFooter, CardHeader } from "@nextui-org/react";

const Predictions = ({
  competitions,
}: {
  competitions: SelectUserCompetition[];
}) => {
  return (
    <div className="flex w-full">
      <Carousel
        items={competitions.map((competition: SelectUserCompetition, index) => (
          <PredictionCard key={index} competition={competition} />
        ))}
      />
    </div>
  );
};

const PredictionCard = async ({
  competition,
}: {
  competition: SelectUserCompetition;
}) => {
  const compData = await getCompetitionFromId(competition.competitionId);

  const siteId = compData?.siteId;

  const compSiteData = await getSiteDataById(siteId!);

  if (!compData || !compSiteData) return null;

  const url = getSiteDomain(compSiteData!) + "/comp/" + compData?.slug;

  return (
    <HoverBorderGradient
      containerClassName="group h-[350px] w-[300px] relative rounded-xl overflow-hidden"
      className="hover: relative h-full w-full transition-all duration-400"
      color={compSiteData.color1}
    >
      <Card isFooterBlurred radius="md" className="h-full w-full border-none">
        <BlurImage
          alt={"Card thumbnail"}
          className="h-full w-full rounded-xl object-cover transition-all duration-100 group-hover:scale-110"
          src={compData.image || "/vLogo.png"}
          placeholder="blur"
          fill
          blurDataURL={placeholderBlurhash}
        />
        <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large bg-background/60 py-1 shadow-small before:rounded-xl">
          <div className="flex w-full flex-col gap-1">
            <p className="">
              {new Date(competition.submissionDate).toDateString()}
            </p>
            <p className="">
              {parseFloat(competition.points || "0").toFixed(2)} Points
            </p>
          </div>
          <Link href={url} target="_blank" rel="noreferrer">
            <PlayButton
              color1={compSiteData.color1}
              color2={compSiteData.color2}
            >
              View
            </PlayButton>
          </Link>
        </CardFooter>
      </Card>
    </HoverBorderGradient>
  );
};

export default Predictions;
