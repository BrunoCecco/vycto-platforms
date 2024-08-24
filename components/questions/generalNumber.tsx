"use client";
import Image from "next/image";
import PointsBadge from "../pointsBadge";
import Submit from "./submit";
import { useState } from "react";
import { MinusCircle, PlusCircle } from "lucide-react";
import Input from "../input";

const GeneralNumber = ({ ...props }) => {
  const [answer, setAnswer] = useState(props.answer ?? 0);

  return (
    <div className="flex items-center justify-center">
      <div className="relative h-full w-full rounded-lg bg-white p-6 shadow-xl md:w-1/2">
        {/* Points Badge */}
        <PointsBadge points={props.points} />

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 h-32 w-full overflow-hidden rounded-lg bg-green-100">
          <Image
            src={props.image1 ?? "/placeholder.png"}
            unoptimized
            alt="True or False Image"
            width={500}
            height={200}
            objectFit="cover"
            className="rounded-lg"
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
              name="answer"
              value={answer}
              onChange={(e) => setAnswer(parseInt(e.target.value))}
              className="w-20 text-center"
            />
          </div>
          <p className="text-sm font-semibold">{props.answer2}</p>
        </div>
        <div className="flex justify-around">
          <Submit
            userId={props.userId}
            questionId={props.id}
            competitionId={props.competitionId}
            answer={answer.toString()}
          >
            <button
              className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white"
              disabled={props.disabled}
            >
              Submit
            </button>
          </Submit>
        </div>
        {props.correctAnswer?.length > 0 ? (
          <div className="mt-2 text-center font-semibold text-green-600">
            Correct answer: {props.correctAnswer}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GeneralNumber;
