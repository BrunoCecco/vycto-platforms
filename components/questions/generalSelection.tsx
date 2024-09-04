"use client";
import Image from "next/image";
import { FC, useEffect } from "react";
import { useState } from "react";
import PointsBadge from "../pointsBadge";
import { answerQuestion } from "@/lib/actions";
import Submit from "./submit";
import QuestionResultBlock from "../questionResultBlock";

const GeneralSelection = ({ ...props }) => {
  const [selectedOption, setSelectedOption] = useState(
    props.answer.answer || "",
  );
  const goalOptions = [];
  if (props.answer1 && props.answer1 != "") goalOptions.push(props.answer1);
  if (props.answer2 && props.answer2 != "") goalOptions.push(props.answer2);
  if (props.answer3 && props.answer3 != "") goalOptions.push(props.answer3);
  if (props.answer4 && props.answer4 != "") goalOptions.push(props.answer4);

  useEffect(() => {
    const updateAnswer = async () => {
      const formData = new FormData();
      formData.append("answer", selectedOption);
      formData.append("questionId", props.questionId);
      formData.append("competitionId", props.competitionId);
      formData.append("userId", props.userId);
      await answerQuestion(formData);
    };
    if (selectedOption != "") {
      updateAnswer();
    }
  }, [selectedOption]);

  return (
    <div className="flex w-full items-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:p-10">
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
        <p className="text-center text-gray-500">
          Select correctly to score points
        </p>

        <div className="flex flex-col justify-center pt-3">
          <div className="flex w-full flex-wrap items-center justify-around rounded-lg bg-gray-200 p-2">
            {goalOptions.map((option, index) => (
              <Submit
                key={"option" + index}
                userId={props.userId}
                competitionId={props.competitionId}
                questionId={props.id}
                answer={option}
                onLocalAnswer={props.onLocalAnswer}
              >
                <button
                  disabled={props.disabled}
                  className={`w-max rounded-lg px-4 py-3 text-sm ${
                    selectedOption === option
                      ? "bg-white font-semibold text-blue-600 shadow-md"
                      : ""
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </button>
              </Submit>
            ))}
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
    </div>
  );
};

export default GeneralSelection;
