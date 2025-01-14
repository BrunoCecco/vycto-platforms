"use client";
import Image from "next/image";
import PointsBadge from "../competitions/pointsBadge";
import Submit from "./submit";
import { useEffect, useRef, useState } from "react";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Button, Input } from "@nextui-org/react";
import QuestionResultBlock from "../competitions/questionResultBlock";
import { TextGenerateEffect } from "../ui/textGenerateEffect";
import { WideImage } from "./wideImage";
import { IQuestionProps } from "@/lib/types";
import Counter from "./counter";

const GeneralNumber = ({ ...props }: IQuestionProps) => {
  const [answer, setAnswer] = useState<string>(props.answer?.answer || "0");

  const submitButton = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (submitButton.current) {
      submitButton.current.click();
    }
  }, [answer]);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative h-full w-full rounded-lg p-4 shadow-xl">
        {/* Points Badge */}
        <PointsBadge points={props.points} color={props.color} />

        <WideImage src={props.image1} color={props.color} />

        {/* Question */}
        <TextGenerateEffect words={props.question || ""} color={props.color} />
        <p className="mb-6 text-center text-xs md:text-sm">
          Answer correctly to score points.
        </p>

        <Submit
          userId={props.userId}
          questionId={props.id}
          competitionId={props.competitionId}
          siteId={props.siteId}
          answer={answer.toString()}
          onLocalAnswer={props.onLocalAnswer}
        >
          {/* <Input
            type="number"
            min={0}
            isDisabled={props.disabled}
            name="answer"
            value={answer}
            defaultValue="1"
            onChange={(e) => setAnswer(e.target.value)}
            className="w-20 text-center"
            classNames={{
              input: " text-sm sm:text-xl",
              inputWrapper: "bg-content4",
            }}
            onBlur={() => submitButton?.current?.click()}
          /> */}
          <input
            type="submit"
            className="hidden"
            name="answer"
            value={answer}
          />
          <Counter
            disabled={props.disabled}
            defaultValue={0}
            onChange={(val: 1 | -1) =>
              setAnswer((prev) => (parseInt(prev) + val).toString())
            }
          />
          <Button className="hidden" type="submit" ref={submitButton}></Button>
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

export default GeneralNumber;
