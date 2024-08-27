"use client";
import Image from "next/image";
import { FC, useState } from "react";
import PointsBadge from "../pointsBadge";
import { PlusCircle, MinusCircle } from "lucide-react";
import Submit from "./submit";

const GuessScore = ({ ...props }) => {
  const [scoreHome, setScoreHome] = useState(props.answer?.split("-")[0] ?? 0);
  const [scoreAway, setScoreAway] = useState(props.answer?.split("-")[1] ?? 0);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:p-10">
        {/* Points Badge */}
        <PointsBadge points={props.points} />

        <h2 className="mb-12 text-xl font-semibold text-gray-800">
          Guess the score 🔥
        </h2>

        {/* Teams */}
        <div className="flex w-full items-center justify-between gap-4 py-4 md:justify-around md:px-4">
          <div className="flex flex-col items-center gap-4 text-gray-500">
            <div className="flex items-center gap-4 md:gap-8">
              <button
                onClick={() => setScoreHome(Math.max(scoreHome - 1, 0))}
                disabled={props.disabled}
              >
                <MinusCircle />
              </button>
              <div>{scoreHome}</div>
              <button
                onClick={() => setScoreHome(scoreHome + 1)}
                disabled={props.disabled}
              >
                <PlusCircle />
              </button>
            </div>
            <p className="text-sm font-semibold">{props.answer1}</p>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="rounded-full border-2 border-blue-600 p-2 text-sm font-bold italic text-blue-600 md:text-xl">
              VS
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 text-gray-500">
            <div className="flex items-center gap-4 md:gap-8">
              <button
                onClick={() => setScoreAway(Math.max(scoreAway - 1, 0))}
                disabled={props.disabled}
              >
                <MinusCircle />
              </button>
              <div>{scoreAway}</div>
              <button
                onClick={() => setScoreAway(scoreAway + 1)}
                disabled={props.disabled}
              >
                <PlusCircle />
              </button>
            </div>
            <p className="text-sm font-semibold">{props.answer2}</p>
          </div>
        </div>

        <Submit
          userId={props.userId}
          questionId={props.id}
          competitionId={props.competitionId}
          answer={`${scoreHome}-${scoreAway}`}
        >
          <button
            className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white"
            disabled={props.disabled}
          >
            Submit
          </button>
        </Submit>
        {props.correctAnswer?.length > 0 ? (
          <div className="mt-2 text-center font-semibold text-green-600">
            Correct answer: {props.correctAnswer}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GuessScore;
