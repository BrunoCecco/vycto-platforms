"use client";
import Image from "next/image";
import { FC, useState } from "react";
import Slider from "../slider";
import PointsBadge from "../pointsBadge";
import { SelectQuestion } from "@/lib/schema";

const EditWhatMinute = ({ question }: { question: SelectQuestion }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState("What minute?");
  const [points, setPoints] = useState(0);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    console.log("Slider value:", value);
  };

  const handleQuestionClick = () => {
    setIsEditingQuestion(true);
  };

  const handlePointsClick = () => {
    setIsEditingPoints(true);
  };

  const handleQuestionInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedQuestion(e.target.value);
  };

  const handlePointsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(Number(e.target.value));
  };

  const handleInputBlur = () => {
    setIsEditingQuestion(false);
    setIsEditingPoints(false);
  };

  const handleSave = () => {
    alert(`Question saved: ${editedQuestion}, Points: ${points}`);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative h-full rounded-lg bg-white p-6 shadow-xl">
        {/* Editable Points Badge */}
        <div className="mb-4 flex justify-center">
          {isEditingPoints ? (
            <input
              type="number"
              value={points}
              onChange={handlePointsInputChange}
              onBlur={handleInputBlur}
              autoFocus
              className="w-20 text-center text-xl font-semibold text-gray-800"
            />
          ) : (
            <div className="cursor-pointer" onClick={handlePointsClick}>
              <PointsBadge points={points} />
            </div>
          )}
        </div>

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 h-32 w-full overflow-hidden rounded-lg bg-green-100">
          <Image
            src={"/trueFalse.jpg"}
            alt="Question Image"
            layout="responsive"
            width={500}
            height={200}
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        {/* Editable Question */}
        <div className="mb-1 text-center">
          {isEditingQuestion ? (
            <input
              type="text"
              value={editedQuestion}
              onChange={handleQuestionInputChange}
              onBlur={handleInputBlur}
              autoFocus
              className="w-full text-center text-xl font-semibold text-gray-800"
            />
          ) : (
            <h2
              className="cursor-pointer text-xl font-semibold text-gray-800"
              onClick={handleQuestionClick}
            >
              {editedQuestion}
            </h2>
          )}
        </div>
        <p className="text-center text-gray-500">
          The closer you get, the more points you score
        </p>

        <div className="flex items-center justify-center">
          <Slider initialValue={sliderValue} onChange={handleSliderChange} />
        </div>

        {/* Save Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSave}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditWhatMinute;
