"use client";
import { useState, FC, useEffect } from "react";
import Image from "next/image";
import PointsBadge from "../competitions/pointsBadge";
import { answerQuestion } from "@/lib/actions";
import Submit from "./submit";
import QuestionResultBlock from "../competitions/questionResultBlock";
import FlipText from "../ui/flipText";

const MatchOutcome = ({ ...props }) => {
  const [selectedOutcome, setSelectedOutcome] = useState(
    props.answer.answer || "",
  );

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:p-10">
        {/* Points Badge */}
        <PointsBadge points={props.points || 0} />

        {/* Match Info */}
        <FlipText
          word={props.question}
          className="mb-1 text-center text-xl font-semibold text-gray-800"
        />
        <p className="text-sm text-gray-500">Pick the winner to score points</p>

        {/* Teams */}
        <div className="flex w-full items-center justify-between py-4 md:justify-around md:px-4">
          {/* Home Team */}
          <Submit
            userId={props.userId}
            questionId={props.id}
            competitionId={props.competitionId}
            answer={props.answer1}
            onLocalAnswer={props.onLocalAnswer}
          >
            <button
              className={`text-center ${
                selectedOutcome === props.answer1 ? "opacity-100" : "opacity-50"
              }`}
              disabled={props.disabled}
              onClick={() => setSelectedOutcome(props.answer1)}
            >
              <div className="flex flex-col items-center">
                <div className="relative h-full w-28 items-center justify-center overflow-hidden rounded-lg md:w-36">
                  <Image
                    src={props.image1 ?? "/placeholder.png"}
                    unoptimized
                    alt="Option 1 Image"
                    width={1}
                    height={1}
                    className="h-100% w-auto object-cover"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {props.answer1}
                </p>
              </div>
            </button>
          </Submit>

          {/* VS */}
          <div className="text-center">
            <div className="rounded-full border-2 border-blue-600 p-2 text-sm font-bold italic text-blue-600 md:text-xl">
              VS
            </div>
          </div>

          {/* Away Team */}
          <Submit
            userId={props.userId}
            questionId={props.id}
            competitionId={props.competitionId}
            answer={props.answer2}
            onLocalAnswer={props.onLocalAnswer}
          >
            <button
              className={`text-center ${
                selectedOutcome === props.answer2 ? "opacity-100" : "opacity-50"
              }`}
              disabled={props.disabled}
              onClick={() => setSelectedOutcome(props.answer2)}
            >
              <div className="flex flex-col items-center">
                <div className="relative h-full w-28 items-center justify-center overflow-hidden rounded-lg md:w-36">
                  <Image
                    src={props.image2 ?? "/placeholder.png"}
                    unoptimized
                    alt="Option 2 Image"
                    width={1}
                    height={1}
                    className="h-100% w-auto object-cover"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {props.answer2}
                </p>
              </div>
            </button>
          </Submit>
        </div>

        {/* Draw Button */}

        <div className="flex justify-center">
          <Submit
            userId={props.userId}
            questionId={props.id}
            competitionId={props.competitionId}
            answer="Draw"
            onLocalAnswer={props.onLocalAnswer}
          >
            <button
              className={`w-24 rounded-full border-2 border-blue-600 bg-white p-2 text-sm font-semibold text-blue-600 ${
                selectedOutcome == "Draw" ? "opacity-100" : "opacity-50"
              }`}
              disabled={props.disabled}
              onClick={() => setSelectedOutcome("Draw")}
            >
              Draw
            </button>
          </Submit>
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

export default MatchOutcome;
