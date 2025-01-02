import Image from "next/image";
import { FC, useState } from "react";
import Slider from "../competitions/slider";
import PointsBadge from "../competitions/pointsBadge";
import QuestionResultBlock from "../competitions/questionResultBlock";
import { WideImage } from "./wideImage";
import { TextGenerateEffect } from "../ui/textGenerateEffect";

const WhatMinute = ({ ...props }) => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative h-full w-full rounded-lg p-4 shadow-xl md:shadow-2xl">
        {/* Points Badge */}
        <PointsBadge points={props.points} color={props.color} />

        <WideImage src={props.image1} color={props.color} />
        <TextGenerateEffect words={props.question || ""} color={props.color} />
        <p className="mb-6 text-center text-xs md:text-sm">
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
            color={props.color}
          />
        </div>
        {props.correctAnswer?.length > 0 && props.hasEnded ? (
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
