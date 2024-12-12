"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  SelectCompetition,
  SelectSite,
  SelectUser,
  SelectUserCompetition,
} from "@/lib/schema";
import Leaderboard from "../leaderboard/leaderboard";
import BlurImage from "../media/blurImage";
import { placeholderBlurhash } from "@/lib/utils";

interface RewardsProps {
  siteData: SelectSite;
  competition: SelectCompetition;
  users: SelectUserCompetition[];
}

const Rewards: React.FC<RewardsProps> = ({ siteData, competition, users }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const rewards = [
    {
      src: competition.rewardImage,
      title: competition.rewardTitle,
      description: competition.rewardDescription,
    },
    {
      src: competition.reward2Image,
      title: competition.reward2Title,
      description: competition.reward2Description,
    },
    {
      src: competition.reward3Image,
      title: competition.reward3Title,
      description: competition.reward3Description,
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 1 ? 0 : prevIndex + 1));
  };

  return competition?.rewardTitle || competition?.reward2Title ? (
    <div className="relative mx-auto w-full max-w-2xl pb-12 pt-6 md:py-20">
      <div className="relative overflow-hidden py-2">
        <div
          className="flex justify-between transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {competition?.rewardTitle ? (
            <div className="flex min-w-full items-center justify-center overflow-hidden rounded-lg">
              <BlurImage
                alt={`Slide ${1}`}
                width={1200}
                height={630}
                className="h-full w-full rounded-lg object-cover"
                placeholder="blur"
                blurDataURL={rewards[0].src || placeholderBlurhash}
                src={rewards[0].src || "/placeholder.png"}
              />
            </div>
          ) : null}
          {competition?.reward2Title ? (
            <div className="flex min-w-full items-center justify-center overflow-hidden rounded-lg">
              <BlurImage
                alt={`Slide ${1}`}
                width={1200}
                height={630}
                className="h-full w-full rounded-lg object-cover"
                placeholder="blur"
                blurDataURL={rewards[1].src || placeholderBlurhash}
                src={rewards[1].src || "/placeholder.png"}
              />
            </div>
          ) : null}
        </div>
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-yellow-500 p-2"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-yellow-500 p-2"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      <div className="md:mt-4">
        <h3 className="text-center text-lg font-bold">
          {rewards[currentIndex].title}
        </h3>
        <p className="text-md mt-2 text-left md:text-center">
          {rewards[currentIndex].description}
        </p>
      </div>
    </div>
  ) : (
    <div className="pt-20 text-center">
      <h2>Sorry, no rewards available yet</h2>
    </div>
  );
};

export default Rewards;
