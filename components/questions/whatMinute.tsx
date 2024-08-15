"use client";
import Image from "next/image";
import { FC, useState } from "react";
import Slider from "../slider";
import PointsBadge from "../pointsBadge";

interface WhatMinuteProps {
  question: string;
  imageSrc: string;
  points: number;
}

const WhatMinute: FC<WhatMinuteProps> = ({ question, imageSrc, points }) => {
  const [sliderValue, setSliderValue] = useState(0);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    console.log("Slider value:", value);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative h-full rounded-lg bg-white p-6 shadow-xl">
        {/* Points Badge */}
        <PointsBadge points={points} />

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 h-32 w-full overflow-hidden rounded-lg bg-green-100">
          <Image
            src={imageSrc}
            alt="Question Image"
            layout="responsive"
            width={500}
            height={200}
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        {/* Question */}
        <h2 className="mb-1 text-center text-xl font-semibold text-gray-800">
          {question}
        </h2>
        <p className="text-center text-gray-500">
          The closer you get, the more points you score
        </p>

        <div className="flex items-center justify-center">
          <Slider initialValue={sliderValue} onChange={handleSliderChange} />
        </div>
      </div>
    </div>
  );
};

export default WhatMinute;
