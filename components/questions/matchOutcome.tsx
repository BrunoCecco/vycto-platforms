"use client";
import { useState, FC, useEffect } from "react";
import Image from "next/image";
import PointsBadge from "../pointsBadge";
import { answerQuestion } from "@/lib/actions";
import Submit from "./submit";

const MatchOutcome = ({ ...props }) => {
  const [selectedOutcome, setSelectedOutcome] = useState(props.answer || "");

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:w-1/2 md:p-10">
        {/* Points Badge */}
        <PointsBadge points={props.points} />

        {/* Match Info */}
        <h2 className="text-lg font-semibold text-gray-800 md:text-xl">
          {props.question}
        </h2>
        <p className="text-sm text-gray-500">Pick the winner to score points</p>

        {/* Teams */}
        <div className="flex w-full items-center justify-between py-4 md:justify-around md:px-4">
          {/* Home Team */}
          <div
            className={`cursor-pointer text-center ${
              selectedOutcome === props.answer1 ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => setSelectedOutcome(props.answer1)}
          >
            <Submit
              userId={props.userId}
              questionId={props.id}
              competitionId={props.competitionId}
              answer={props.answer1}
            >
              <div className="relative h-20 w-24 overflow-hidden rounded-lg border md:h-24 md:w-32">
                <Image
                  src={props.image1}
                  alt={props.answer1}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </Submit>
            <p className="text-sm font-semibold text-gray-700">
              {props.answer1}
            </p>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="rounded-full border-2 border-blue-600 p-2 text-sm font-bold italic text-blue-600 md:text-xl">
              VS
            </div>
          </div>

          {/* Away Team */}
          <div
            className={`cursor-pointer text-center ${
              selectedOutcome === props.answer2 ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => setSelectedOutcome(props.answer2)}
          >
            <div className="relative h-20 w-24 overflow-hidden rounded-lg border md:h-24 md:w-32">
              <Image src={props.image2} alt={props.answer2} objectFit="cover" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {props.answer2}
            </p>
          </div>
        </div>

        {/* Draw Button */}
        <div className="flex justify-center">
          <button
            className={`w-24 rounded-full border-2 border-blue-600 bg-white p-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 ${
              selectedOutcome === props.answer3 ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => setSelectedOutcome("Draw")}
          >
            Draw
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchOutcome;
