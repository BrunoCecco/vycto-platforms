"use client";
import Image from "next/image";
import { FC } from "react";
import Slider from "../slider";
import PointsBadge from "../pointsBadge";
import GoalSelector from "../goalSelector";

const PlayerGoals = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:w-1/2 md:p-10">
        {/* Points Badge */}
        <PointsBadge points={5} />

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 h-32 w-full overflow-hidden rounded-lg bg-green-100">
          <Image
            src={"/trueFalse.jpg"}
            alt="True or False Image"
            layout="responsive"
            width={500}
            height={200}
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        {/* Question */}
        <h2 className="mb-1 text-center text-xl font-semibold text-gray-800">
          How many goals will Morata score?
        </h2>
        <p className="text-center text-gray-500">
          Select correctly to score points
        </p>

        <div className="flex items-center justify-center pt-3">
          <GoalSelector />
        </div>
      </div>
    </div>
  );
};

export default PlayerGoals;
