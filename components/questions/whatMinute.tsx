import Image from "next/image";
import { FC, useState } from "react";
import Slider from "../slider";
import PointsBadge from "../pointsBadge";

const WhatMinute = ({ ...props }) => {
  console.log(props);
  return (
    <div className="flex items-center justify-center">
      <div className="relative h-full w-full rounded-lg bg-white p-6 shadow-xl md:w-1/2">
        {/* Points Badge */}
        <PointsBadge points={props.points} />

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 h-32 w-full overflow-hidden rounded-lg bg-green-100">
          <Image
            src={props.image1 ?? "/placeholder.png"}
            unoptimized
            alt="Question Image"
            width={500}
            height={200}
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        {/* Question */}
        <h2 className="mb-1 text-center text-xl font-semibold text-gray-800">
          {props.question}
        </h2>
        <p className="text-center text-gray-500">
          The closer you get, the more points you score
        </p>
        <div className="flex items-center justify-center">
          <Slider
            initialValue={props.answer}
            userId={props.userId}
            questionId={props.id}
            disabled={props.disabled}
          />
        </div>
        {props.correctAnswer?.length > 0 ? (
          <div className="mt-2 text-center font-semibold text-green-600">
            Correct answer: {props.correctAnswer}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WhatMinute;
