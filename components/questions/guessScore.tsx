"use client";
import { FC, useRef, useState, useCallback, useEffect } from "react";
import PointsBadge from "../competitions/pointsBadge";
import { PlusCircle, MinusCircle } from "lucide-react";
import Submit from "./submit";
import QuestionResultBlock from "../competitions/questionResultBlock";
import { Button } from "@nextui-org/react";
import { TextGenerateEffect } from "../ui/textGenerateEffect";
import Counter from "./counter";
import { IQuestionProps } from "@/lib/types";
import Image from "next/image";

const GuessScore = ({ ...props }: IQuestionProps) => {
  const [scores, setScores] = useState({
    home: parseInt(props.answer?.answer?.split("-")[0] || "0", 10),
    away: parseInt(props.answer?.answer?.split("-")[1] || "0", 10),
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
      <div className="relative w-full rounded-lg p-4 shadow-xl">
        {/* Points Badge */}
        <PointsBadge points={props.points} color={props.color} />

        <TextGenerateEffect words={"Guess the score"} color={props.color} />
        {/* Teams */}
        <Submit
          userId={props.userId}
          questionId={props.id}
          competitionId={props.competitionId}
          siteId={props.siteId}
          answer={`${scores.home}-${scores.away}`}
          onLocalAnswer={props.onLocalAnswer}
        >
          <div
            className="flex w-full items-center justify-around gap-4 py-4 text-center md:justify-around md:px-4"
            onBlur={() => submitButton?.current?.click()}
          >
            <div className="flex basis-1/3 flex-col items-center gap-4">
              <div
                className={`relative h-[80px] w-[80px] items-center justify-center text-center md:h-[150px] md:w-[150px]`}
              >
                <Image
                  src={props.image1 || "/placeholder.png"}
                  alt="Option 1 Image"
                  fill
                  unoptimized
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2 md:gap-8">
                <Counter
                  disabled={props.disabled}
                  team="home"
                  defaultValue={scores.home}
                  onChange={(val: 1 | -1) => updateScore("home", val === 1)}
                />
              </div>
              <p className="break-words text-sm font-semibold">
                {props.answer1}
              </p>
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

            <div className="flex basis-1/3 flex-col items-center gap-4">
              <div
                className={`relative h-[80px] w-[80px] items-center justify-center text-center md:h-[150px] md:w-[150px]`}
              >
                <Image
                  src={props.image2 || "/placeholder.png"}
                  alt="Option 2 Image"
                  fill
                  unoptimized
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2 md:gap-8">
                <Counter
                  disabled={props.disabled}
                  team="away"
                  defaultValue={scores.away}
                  onChange={(val: 1 | -1) => updateScore("away", val === 1)}
                />
              </div>
              <p className="break-words text-sm font-semibold">
                {props.answer2}
              </p>
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
        {props.answer &&
        "points" in props.answer &&
        props.correctAnswer?.length &&
        props.correctAnswer?.length > 0 &&
        props.hasEnded ? (
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
