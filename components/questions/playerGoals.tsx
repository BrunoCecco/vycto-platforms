"use client";
import Image from "next/image";
import { FC, useEffect } from "react";
import Slider from "../slider";
import { useState } from "react";
import PointsBadge from "../pointsBadge";
import GoalSelector from "../goalSelector";
import { answerQuestion } from "@/lib/actions";

const PlayerGoals = ({ ...props }) => {
  const [selectedOption, setSelectedOption] = useState("");
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
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:w-1/2 md:p-10">
        {/* Points Badge */}
        <PointsBadge points={props.points} />

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 h-32 w-full overflow-hidden rounded-lg bg-green-100">
          <Image
            src={props.image1 ?? "/placeholder.png"}
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
        <p className="text-center text-gray-500">
          Select correctly to score points
        </p>

        <div className="flex items-center justify-center pt-3">
          <GoalSelector
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            options={goalOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerGoals;
