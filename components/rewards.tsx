"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RewardsProps {
  rewardTitle: any;
  rewardDescription: any;
  rewardImage: any;
  reward2Title: any;
  reward2Description: any;
  reward2Image: any;
}

const Rewards: React.FC<RewardsProps> = ({
  rewardTitle,
  rewardDescription,
  rewardImage,
  reward2Title,
  reward2Description,
  reward2Image,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const rewards = [
    {
      src: rewardImage,
      title: rewardTitle,
      description: rewardDescription,
    },
    {
      src: reward2Image,
      title: reward2Title,
      description: reward2Description,
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 1 ? 0 : prevIndex + 1));
  };

  return rewardTitle?.length > 0 && reward2Title?.length > 0 ? (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative overflow-hidden">
        <div
          className="flex justify-between transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {[0, 1].map((index) => (
            <div
              key={index}
              className="flex h-[400px] min-w-full items-center justify-center"
            >
              <Image
                src={rewards[index].src || "/placeholder.png"}
                alt={`Slide ${index + 1}`}
                height={400}
                width={400}
                objectFit="contain"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-yellow-500 p-2 text-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-yellow-500 p-2 text-white"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-xl font-bold">{rewards[currentIndex].title}</h2>
        <p className="text-md">{rewards[currentIndex].description}</p>
      </div>
    </div>
  ) : (
    <div className="text-center">
      <h2>Sorry, no rewards available</h2>
    </div>
  );
};

export default Rewards;
