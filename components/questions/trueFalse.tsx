"use client";
import Image from "next/image";
import PointsBadge from "../pointsBadge";
import Submit from "./submit";
import { useState } from "react";

const Button = ({
  children,
  selected,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="submit"
      className="w-24 rounded-full border-2 border-blue-600 bg-white p-2 text-sm font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:opacity-75"
      style={{
        backgroundColor: selected ? "blue" : "white",
        color: selected ? "white" : "blue",
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const TrueFalse = ({ ...props }) => {
  const [selected, setSelected] = useState(props.answer ?? "");

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative h-full w-full rounded-lg bg-white p-6 shadow-xl">
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
          Select correctly to score points
        </p>

        <div className="flex justify-around">
          <Submit
            userId={props.userId}
            competitionId={props.competitionId}
            questionId={props.id}
            answer="True"
          >
            <Button
              selected={selected == "True"}
              disabled={props.disabled}
              onClick={() => setSelected("True")}
            >
              True
            </Button>
          </Submit>
          <Submit
            userId={props.userId}
            competitionId={props.competitionId}
            questionId={props.id}
            answer="False"
          >
            <Button
              selected={selected == "False"}
              disabled={props.disabled}
              onClick={() => setSelected("False")}
            >
              False
            </Button>
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

export default TrueFalse;
