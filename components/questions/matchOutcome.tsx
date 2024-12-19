"use client";
import { useState, FC, useEffect } from "react";
import Image from "next/image";
import PointsBadge from "../competitions/pointsBadge";
import { answerQuestion } from "@/lib/actions";
import Submit from "./submit";
import QuestionResultBlock from "../competitions/questionResultBlock";
import { Button, Card, CardFooter } from "@nextui-org/react";
import { TextGenerateEffect } from "../ui/textGenerateEffect";

const MatchOutcome = ({ ...props }) => {
  const [selectedOutcome, setSelectedOutcome] = useState(
    props.answer.answer || "",
  );

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative w-full rounded-lg p-4 shadow-xl">
        {/* Points Badge */}
        <PointsBadge points={props.points} color={props.color} />

        <TextGenerateEffect words={props.question || ""} color={props.color} />
        <p className="text-center text-xs md:text-sm">
          Pick the winner to score points
        </p>

        {/* Teams */}
        <div className="flex w-full items-center justify-between gap-1 py-4 sm:gap-2 md:justify-around md:px-4">
          {/* Home Team */}
          <Submit
            userId={props.userId}
            questionId={props.id}
            competitionId={props.competitionId}
            answer={props.answer1}
            onLocalAnswer={props.onLocalAnswer}
          >
            <Card isFooterBlurred>
              <Button
                className={`relative h-[140px] w-[100px] items-center justify-center overflow-hidden text-center md:h-[250px] md:w-[180px] ${
                  selectedOutcome === props.answer1
                    ? "opacity-100"
                    : "opacity-25"
                }`}
                type="submit"
                isDisabled={props.disabled}
                onClick={() => setSelectedOutcome(props.answer1)}
              >
                <Image
                  src={props.image1 || "/placeholder.png"}
                  alt="Option 1 Image"
                  fill
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </Button>
              <CardFooter className="absolute bottom-0 z-10 flex w-full justify-center overflow-hidden rounded-b-lg bg-background/20 py-1 text-center text-xs shadow-sm md:text-sm">
                {props.answer1}
              </CardFooter>
            </Card>
          </Submit>

          {/* VS */}
          <div className="text-center">
            <div
              className="rounded-full border-2 p-1 pr-1.5 text-sm text-xs font-bold italic sm:p-2 sm:pr-3 sm:text-xl"
              style={{ borderColor: props.color, color: props.color }}
            >
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
            <Card isFooterBlurred>
              <Button
                className={`relative h-[140px] w-[100px] items-center justify-center overflow-hidden text-center md:h-[250px] md:w-[180px] ${
                  selectedOutcome === props.answer2
                    ? "opacity-100"
                    : "opacity-25"
                }`}
                type="submit"
                isDisabled={props.disabled}
                onClick={() => setSelectedOutcome(props.answer2)}
              >
                <Image
                  src={props.image2 || "/placeholder.png"}
                  alt="Option 2 Image"
                  fill
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </Button>
              <CardFooter className="absolute bottom-0 z-10 flex w-full justify-center overflow-hidden rounded-b-lg bg-background/20 py-1 text-center text-xs shadow-sm md:text-sm">
                {props.answer2}
              </CardFooter>
            </Card>
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
            <Button
              className={`w-24 rounded-full border-2 p-2 text-sm font-semibold ${
                selectedOutcome == "Draw" ? "opacity-100" : "opacity-25"
              }`}
              type="submit"
              isDisabled={props.disabled}
              style={{ borderColor: props.color }}
              onClick={() => setSelectedOutcome("Draw")}
            >
              Draw
            </Button>
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
