"use client";
import { useState, FC, useEffect } from "react";
import Image from "next/image";
import PointsBadge from "../competitions/pointsBadge";
import { answerQuestion } from "@/lib/actions";
import Submit from "./submit";
import QuestionResultBlock from "../competitions/questionResultBlock";
import FlipText from "../ui/flipText";
import { Button, Card, CardFooter } from "@nextui-org/react";

const MatchOutcome = ({ ...props }) => {
  const [selectedOutcome, setSelectedOutcome] = useState(
    props.answer.answer || "",
  );

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative w-full rounded-lg p-4 shadow-xl md:p-10">
        {/* Points Badge */}
        <PointsBadge points={props.points} color={props.color} />

        {/* Match Info */}
        <FlipText
          word={props.question}
          className="mb-1 text-center text-xl font-semibold "
        />
        <p className="text-center text-sm">Pick the winner to score points</p>

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
            <Card isFooterBlurred>
              <Button
                className={`relative h-[250px] w-[180px] items-center justify-center overflow-hidden text-center ${
                  selectedOutcome === props.answer1
                    ? "opacity-100"
                    : "opacity-50"
                }`}
                isDisabled={props.disabled}
                onClick={() => setSelectedOutcome(props.answer1)}
              >
                <Image
                  src={props.image1 || "/placeholder.png"}
                  alt="Option 1 Image"
                  fill
                  className="h-full w-full object-contain"
                />
              </Button>
              <CardFooter className="border-1 bg-background/20 absolute bottom-1 z-10 flex w-full justify-center overflow-hidden rounded-lg border-white/20 py-1 text-center shadow-sm">
                {props.answer1}
              </CardFooter>
            </Card>
          </Submit>

          {/* VS */}
          <div className="text-center">
            <div
              className="rounded-full border-2 p-2 pr-3 text-sm font-bold italic md:text-xl"
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
                className={`relative h-[250px] w-[180px] items-center justify-center overflow-hidden text-center ${
                  selectedOutcome === props.answer2
                    ? "opacity-100"
                    : "opacity-50"
                }`}
                isDisabled={props.disabled}
                onClick={() => setSelectedOutcome(props.answer2)}
              >
                <Image
                  src={props.image2 || "/placeholder.png"}
                  alt="Option 2 Image"
                  fill
                  className="h-full w-full object-contain"
                />
              </Button>
              <CardFooter className="border-1 bg-background/20 absolute bottom-1 z-10 flex w-full justify-center overflow-hidden rounded-lg border-white/20 py-1 text-center shadow-sm">
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
                selectedOutcome == "Draw" ? "opacity-100" : "opacity-50"
              }`}
              isDisabled={props.disabled}
              style={{ borderColor: props.color, color: props.color }}
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
