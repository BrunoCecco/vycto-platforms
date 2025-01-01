"use client";
import Image from "next/image";
import PointsBadge from "../competitions/pointsBadge";
import Submit from "./submit";
import { useState } from "react";
import QuestionResultBlock from "../competitions/questionResultBlock";
import { WideImage } from "./wideImage";
import { TextGenerateEffect } from "../ui/textGenerateEffect";

const Button = ({
  children,
  selected,
  disabled,
  onClick,
  color,
}: {
  children: React.ReactNode;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  color?: string;
}) => {
  return (
    <button
      type="submit"
      className="w-24 rounded-full border-2 border-background p-2 text-sm font-semibold transition-all duration-200 hover:opacity-75"
      style={{
        backgroundColor: selected ? color || "blue" : "background",
        color: selected ? "background" : color || "blue",
        borderColor: color || "blue",
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const TrueFalse = ({ ...props }) => {
  const [selected, setSelected] = useState(props.answer.answer || "");

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative h-full w-full rounded-lg p-4 shadow-xl">
        {/* Points Badge */}
        <PointsBadge points={props.points} color={props.color} />

        <WideImage src={props.image1} color={props.color} />
        <TextGenerateEffect words={props.question || ""} color={props.color} />
        <p className="mb-6 text-center text-xs md:text-sm">
          Select correctly to score points
        </p>

        <div className="flex justify-around">
          <Submit
            userId={props.userId}
            competitionId={props.competitionId}
            questionId={props.id}
            answer="True"
            onLocalAnswer={props.onLocalAnswer}
          >
            <Button
              selected={selected == "True"}
              disabled={props.disabled}
              onClick={() => setSelected("True")}
              color={props.color}
            >
              True
            </Button>
          </Submit>
          <Submit
            userId={props.userId}
            competitionId={props.competitionId}
            questionId={props.id}
            answer="False"
            onLocalAnswer={props.onLocalAnswer}
          >
            <Button
              selected={selected == "False"}
              disabled={props.disabled}
              onClick={() => setSelected("False")}
              color={props.color}
            >
              False
            </Button>
          </Submit>
        </div>
        {props.correctAnswer?.length > 0 && props.hasEnded ? (
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

export default TrueFalse;
