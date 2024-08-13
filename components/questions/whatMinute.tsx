"use client";
import Image from "next/image";
import { FC } from "react";
import Slider from "../slider";
import PointsBadge from "../pointsBadge";

const WhatMinute = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative h-full rounded-lg bg-white p-6 shadow-xl">
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
          What minute will Atletico score vs Inter?
        </h2>
        <p className="text-center text-gray-500">
          The closer you get, the more points you score
        </p>

        <div className="flex items-center justify-center">
          <Slider />
        </div>
      </div>
    </div>
  );
};

export default WhatMinute;
