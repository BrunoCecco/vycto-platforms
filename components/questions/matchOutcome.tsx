"use client";
import { useState, FC, useEffect } from "react";
import Image from "next/image";
import PointsBadge from "../pointsBadge";
import { answerQuestion } from "@/lib/actions";
import Submit from "./submit";

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
        <h2 className="text-lg font-semibold text-gray-800 md:text-xl">
          {props.question}
        </h2>
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
              <div className="relative h-20 w-24 overflow-hidden rounded-lg border md:h-24 md:w-32">
                <Image
                  src={props.image1 ?? "/placeholder.png"}
                  alt={props.answer1}
                  unoptimized={true}
                  width={500}
                  height={200}
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {props.answer1}
              </p>
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
              <div className="relative h-20 w-24 overflow-hidden rounded-lg border md:h-24 md:w-32">
                <Image
                  src={props.image2 ?? "/placeholder.png"}
                  alt={props.answer2}
                  unoptimized
                  width={500}
                  height={200}
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {props.answer2}
              </p>
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
          <div className="mt-2">
            <div>
              Correct answer:{" "}
              <span className="font-semibold">{props.correctAnswer}</span>
            </div>
            <div>
              Points earned:{" "}
              <span className="font-semibold">
                {parseFloat(props.answer?.points || "0").toFixed(2)}
              </span>
              /{props.points?.toString()}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MatchOutcome;
