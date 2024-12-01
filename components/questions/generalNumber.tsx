"use client";
import Image from "next/image";
import PointsBadge from "../competitions/pointsBadge";
import Submit from "./submit";
import { useRef, useState } from "react";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Button, Input } from "@nextui-org/react";
import QuestionResultBlock from "../competitions/questionResultBlock";
import FlipText from "../ui/flipText";
import { TextGenerateEffect } from "../ui/textGenerateEffect";
import { WideImage } from "./wideImage";

const GeneralNumber = ({ ...props }) => {
  const [answer, setAnswer] = useState(props.answer.answer ?? 0);

  const submitButton = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative h-full w-full rounded-lg p-6 shadow-xl">
        {/* Points Badge */}
        <PointsBadge points={props.points} color={props.color} />

        <WideImage src={props.image1} color={props.color} />

        {/* Question */}
        <TextGenerateEffect
          words={props.question}
          className="mb-1 text-center text-xl font-semibold "
        />
        <p className="mb-6 text-center">Answer correctly to score points.</p>

        <Submit
          userId={props.userId}
          questionId={props.id}
          competitionId={props.competitionId}
          answer={answer.toString()}
          onLocalAnswer={props.onLocalAnswer}
        >
          <Input
            type="number"
            min={0}
            isDisabled={props.disabled}
            name="answer"
            value={answer}
            onChange={(e) => setAnswer(parseInt(e.target.value))}
            className="w-20 text-center"
            onBlur={() => submitButton?.current?.click()}
          />
          <Button className="hidden" type="submit" ref={submitButton}></Button>
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

export default GeneralNumber;
