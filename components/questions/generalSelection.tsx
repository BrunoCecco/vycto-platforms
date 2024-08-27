"use client";
import Image from "next/image";
import { FC, useEffect } from "react";
import { useState } from "react";
import PointsBadge from "../pointsBadge";
import { answerQuestion } from "@/lib/actions";
import Submit from "./submit";

const GeneralSelection = ({ ...props }) => {
  const [selectedOption, setSelectedOption] = useState(props.answer || "");
  const goalOptions = [
    props.answer1,
    props.answer2,
    props.answer3,
    props.answer4,
  ];

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
    <div className="flex w-full items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:p-10">
        {/* Points Badge */}
        <PointsBadge points={props.points} />

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 h-32 w-full overflow-hidden rounded-lg bg-green-100">
          <Image
            src={props.image1 ?? "/placeholder.png"}
            alt="True or False Image"
            width={500}
            unoptimized
            height={200}
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        {/* Question */}
        <h2 className="mb-1 text-center text-xl font-semibold text-gray-800">
          {props.question}
        </h2>
        <p className="text-center text-gray-500">
          Select correctly to score points
        </p>

        <div className="flex flex-col items-center justify-center pt-3">
          <div className="flex w-full flex-wrap items-center justify-between rounded-lg bg-gray-200 p-2">
            {goalOptions.map((option) => (
              <Submit
                key={option}
                userId={props.userId}
                competitionId={props.competitionId}
                questionId={props.id}
                answer={option}
              >
                <button
                  key={option}
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
            <div className="mt-2 text-center font-semibold text-green-600">
              Correct answer: {props.correctAnswer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GeneralSelection;
