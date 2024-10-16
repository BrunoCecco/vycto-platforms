import Image from "next/image";
import { FC, useState } from "react";
import Slider from "../competitions/slider";
import PointsBadge from "../competitions/pointsBadge";
import QuestionResultBlock from "../competitions/questionResultBlock";
import FlipText from "@/components/ui/flipText";

const WhatMinute = ({ ...props }) => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative h-full w-full rounded-lg bg-white p-6 shadow-xl md:shadow-2xl">
        {/* Points Badge */}
        <PointsBadge points={props.points} />

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-green-100">
          <Image
            src={props.image1 ?? "/placeholder.png"}
            alt="Question Image"
            width={1}
            height={1}
            className="h-100% w-auto object-cover"
          />
        </div>

        {/* Question */}
        <FlipText
          word={props.question}
          className="mb-1 text-center text-xl font-semibold text-gray-800"
        />
        <p className="text-center text-gray-500">
          The closer you get, the more points you score
        </p>
        <div className="flex items-center justify-center">
          <Slider
            initialValue={props.answer.answer}
            userId={props.userId}
            questionId={props.id}
            competitionId={props.competitionId}
            disabled={props.disabled}
            onLocalAnswer={props.onLocalAnswer}
          />
        </div>
        {props.correctAnswer?.length > 0 ? (
          <QuestionResultBlock
            correctAnswer={props.correctAnswer}
            pointsEarned={parseFloat(props.answer?.points || "0").toFixed(2)}
            totalPoints={props.points?.toString()}
          />
        ) : null}
      </div>
    </div>
  );
};

export default WhatMinute;
