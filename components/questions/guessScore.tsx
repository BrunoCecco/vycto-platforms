"use client";
import { FC, useRef, useState, useCallback, useEffect } from "react";
import PointsBadge from "../competitions/pointsBadge";
import { PlusCircle, MinusCircle } from "lucide-react";
import Submit from "./submit";
import QuestionResultBlock from "../competitions/questionResultBlock";
import FlipText from "../ui/flipText";

const GuessScore = ({ ...props }) => {
  const [scores, setScores] = useState({
    home: parseInt(props.answer.answer?.split("-")[0] ?? "0", 10),
    away: parseInt(props.answer.answer?.split("-")[1] ?? "0", 10),
  });
  const [lastClickTime, setLastClickTime] = useState(0);
  const minTimeBetweenClicks = 200; // 200ms between clicks

  const submitButton = useRef<HTMLButtonElement | null>(null);

  const updateScore = useCallback(
    (team: "home" | "away", increment: boolean) => {
      const currentTime = Date.now();
      if (currentTime - lastClickTime < minTimeBetweenClicks) {
        return; // Ignore click if it's too soon
      }
      setLastClickTime(currentTime);

      setScores((prevScores) => ({
        ...prevScores,
        [team]: Math.max(prevScores[team] + (increment ? 1 : -1), 0),
      }));
    },
    [lastClickTime],
  );

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:p-10">
        {/* Points Badge */}
        <PointsBadge points={props.points} />

        <FlipText
          word={"Guess the score"}
          className="mb-1 text-center text-xl font-semibold text-gray-800"
        />

        {/* Teams */}
        <Submit
          userId={props.userId}
          questionId={props.id}
          competitionId={props.competitionId}
          answer={`${scores.home}-${scores.away}`}
          onLocalAnswer={props.onLocalAnswer}
        >
          <div
            className="flex w-full items-center justify-between gap-4 py-4 md:justify-around md:px-4"
            onBlur={() => submitButton?.current?.click()}
          >
            <div className="flex flex-col items-center gap-4 text-gray-500">
              <div className="flex items-center gap-4 md:gap-8">
                <button
                  onClick={() => updateScore("home", false)}
                  disabled={props.disabled}
                >
                  <MinusCircle />
                </button>
                <div>{scores.home}</div>
                <button
                  onClick={() => updateScore("home", true)}
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
                  onClick={() => updateScore("away", false)}
                  disabled={props.disabled}
                >
                  <MinusCircle />
                </button>
                <div>{scores.away}</div>
                <button
                  onClick={() => updateScore("away", true)}
                  disabled={props.disabled}
                >
                  <PlusCircle />
                </button>
              </div>
              <p className="text-sm font-semibold">{props.answer2}</p>
            </div>
          </div>
          <button
            className="hidden"
            disabled={props.disabled}
            type="submit"
            ref={submitButton}
          >
            Submit
          </button>
        </Submit>
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

export default GuessScore;
