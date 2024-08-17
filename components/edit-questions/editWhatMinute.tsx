"use client";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import Slider from "../slider";
import PointsBadge from "../pointsBadge";
import { SelectQuestion } from "@/lib/schema";
import { deleteQuestion, updateQuestionMetadata } from "@/lib/actions";
import { toast } from "sonner";

const EditWhatMinute = ({
  question,
  removeQuestion,
}: {
  question: SelectQuestion;
  removeQuestion: (id: string) => void;
}) => {
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(
    question.question ?? "What minute?",
  );
  const [points, setPoints] = useState(question.points ?? 0);

  const updateQuestion = async (key: string, value: string) => {
    const formData = new FormData();
    formData.append(key, value);
    console.log("formData", key, value);
    await updateQuestionMetadata(formData, question, key);
    toast.success("Question updated successfully");
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

  const handleInputBlur = async (key: string, value: string) => {
    setIsEditingQuestion(false);
    setIsEditingPoints(false);
    await updateQuestion(key, value);
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this question?")) return;
    removeQuestion(question.id);
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
              onBlur={() => handleInputBlur("points", points.toString())}
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
            src={question.image1 ?? "/trueFalse.jpg"}
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
              onBlur={() => handleInputBlur("question", editedQuestion)}
              autoFocus
              className="mt-1 block w-full rounded-md border border-stone-200 text-center dark:border-stone-700"
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
          <Slider
            initialValue={question.answer1 || "0"}
            questionId={question.id}
            question={question}
          />
        </div>

        {/* Save Button */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            onClick={handleRemove}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditWhatMinute;
