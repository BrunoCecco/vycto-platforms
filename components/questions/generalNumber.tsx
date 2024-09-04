"use client";
import Image from "next/image";
import PointsBadge from "../pointsBadge";
import Submit from "./submit";
import { useState } from "react";
import { MinusCircle, PlusCircle } from "lucide-react";
import Input from "../input";
import QuestionResultBlock from "../questionResultBlock";

const GeneralNumber = ({ ...props }) => {
  const [answer, setAnswer] = useState(props.answer.answer ?? 0);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative h-full w-full rounded-lg bg-white p-6 shadow-xl">
        {/* Points Badge */}
        <PointsBadge points={props.points} />

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-green-100">
          <Image
            src={props.image1 ?? "/placeholder.png"}
            unoptimized
            alt="Question Image"
            width={1}
            height={1}
            objectFit="cover"
            className="h-100% w-auto"
          />
        </div>

        {/* Question */}
        <h2 className="mb-1 text-center text-xl font-semibold text-gray-800">
          {props.question}
        </h2>
        <p className="mb-6 text-center text-gray-500">
          Answer correctly to score points.
        </p>

        <div className="flex flex-col items-center gap-4 text-gray-500">
          <div className="flex items-center gap-4 md:gap-8">
            <Input
              type="number"
              min={0}
              disabled={props.disabled}
              name="answer"
              value={answer}
              onChange={(e) => setAnswer(parseInt(e.target.value))}
              className="w-20 text-center"
            />
          </div>
        </div>

        <Submit
          userId={props.userId}
          questionId={props.id}
          competitionId={props.competitionId}
          answer={answer.toString()}
          onLocalAnswer={props.onLocalAnswer}
        >
          <button
            className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white"
            disabled={props.disabled}
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

export default GeneralNumber;
