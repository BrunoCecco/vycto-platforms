"use client";
import { FC, useRef, useState, useCallback, useEffect } from "react";
import PointsBadge from "../competitions/pointsBadge";
import { PlusCircle, MinusCircle } from "lucide-react";
import Submit from "./submit";
import QuestionResultBlock from "../competitions/questionResultBlock";
import FlipText from "../ui/flipText";
import { Button } from "@nextui-org/react";

const GuessScore = ({ ...props }) => {
  const [scores, setScores] = useState({
    home: parseInt(props.answer.answer?.split("-")[0] || "0", 10),
    away: parseInt(props.answer.answer?.split("-")[1] || "0", 10),
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
      <div className="relative w-full rounded-lg p-4 shadow-xl md:p-10">
        {/* Points Badge */}
        <PointsBadge points={props.points} color={props.color} />

        <FlipText
          word={"Guess the score"}
          className="mb-1 text-center text-xl font-semibold"
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
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 md:gap-8">
                <Button
                  onClick={() => updateScore("home", false)}
                  variant="light"
                  isDisabled={props.disabled}
                >
                  <MinusCircle />
                </Button>
                <div>{scores.home}</div>
                <Button
                  onClick={() => updateScore("home", true)}
                  isDisabled={props.disabled}
                  variant="light"
                >
                  <PlusCircle />
                </Button>
              </div>
              <p className="text-sm font-semibold">{props.answer1}</p>
            </div>

            {/* VS */}
            <div className="text-center">
              <div
                className="rounded-full border-2  p-2 pr-3 text-sm font-bold italic md:text-xl"
                style={{ color: props.color, borderColor: props.color }}
              >
                VS
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 md:gap-8">
                <Button
                  onClick={() => updateScore("away", false)}
                  isDisabled={props.disabled}
                  variant="light"
                >
                  <MinusCircle />
                </Button>
                <div>{scores.away}</div>
                <Button
                  onClick={() => updateScore("away", true)}
                  isDisabled={props.disabled}
                  variant="light"
                >
                  <PlusCircle />
                </Button>
              </div>
              <p className="text-sm font-semibold">{props.answer2}</p>
            </div>
          </div>
          <Button
            className="hidden"
            isDisabled={props.disabled}
            type="submit"
            ref={submitButton}
          >
            Submit
          </Button>
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
