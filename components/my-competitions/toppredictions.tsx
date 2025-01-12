import Image from "next/image";
import { MoveUpRight } from "lucide-react";
import {
  SelectAnswer,
  SelectCompetition,
  SelectQuestion,
  SelectSite,
  SelectUserCompetition,
} from "@/lib/schema";
import {
  getCompetitionFromId,
  getSiteDataById,
  getTopPredictions,
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
import { getTranslations } from "next-intl/server";

interface IPrediction {
  question: SelectQuestion;
  answer: SelectAnswer | null;
}

const TopPredictions = async ({
  compData,
  userId,
  siteId,
}: {
  compData?: SelectCompetition[];
  userId: string;
  siteId: string;
}) => {
  const predictions = await getTopPredictions(userId, siteId);
  return (
    <div className="flex w-full">
      <Carousel
        items={predictions.map((prediction: IPrediction, index: number) => (
          <PredictionCard
            key={index}
            prediction={prediction}
            comp={compData?.find(
              (comp) => comp.id === prediction.question.competitionId,
            )}
          />
        ))}
      />
    </div>
  );
};

const PredictionCard = async ({
  prediction,
  comp,
}: {
  prediction: IPrediction;
  comp?: SelectCompetition;
}) => {
  return (
    <HoverBorderGradient
      containerClassName="group h-[275px] w-[240px] sm:h-[350px] sm:w-[300px] relative rounded-xl overflow-hidden"
      className="hover: relative h-full w-full transition-all duration-400"
      // color={compSiteData.color1}
    >
      <Card isFooterBlurred radius="md" className="h-full w-full border-none">
        <BlurImage
          alt={"Card thumbnail"}
          className="h-full w-full rounded-xl object-cover transition-all duration-100 group-hover:scale-110"
          src={comp?.image || "/vLogo.png"}
          placeholder="blur"
          fill
          blurDataURL={placeholderBlurhash}
        />
        <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-between gap-2 p-4">
          <div className="flex w-full flex-col gap-1">
            <p className="text-xl font-bold sm:text-4xl">
              {prediction.answer?.answer}
            </p>
          </div>
          <Image
            src={prediction.question?.image1 || "/vLogo.png"}
            alt="Card thumbnail"
            className="object-cover transition-all duration-100 group-hover:scale-110"
            height={40}
            width={40}
            unoptimized
          />
          <Image
            src={prediction.question?.image2 || "/vLogo.png"}
            alt="Card thumbnail"
            className="object-cover transition-all duration-100 group-hover:scale-110"
            height={40}
            width={40}
            unoptimized
          />
        </div>
      </Card>
    </HoverBorderGradient>
  );
};

export default TopPredictions;
