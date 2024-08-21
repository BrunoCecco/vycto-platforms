"use client";
import { updateQuestionMetadata } from "@/lib/actions";
import { SelectQuestion } from "@/lib/schema";
import { useState } from "react";
import { toast } from "sonner";
import Uploader from "../old-components/uploader";
import PointsBadge from "../pointsBadge";
import Slider from "../slider";

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
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(
    question.correctAnswer ?? "",
  );
  const [points, setPoints] = useState(question.points ?? 0);
  const [image, setImage] = useState(question.image1 ?? "/placeholder.png");

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

  const handleCorrectAnswerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedCorrectAnswer(e.target.value);
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

  const handleImageChange = async (key: string, value: string) => {
    setImage(value);
    await updateQuestion(key, value);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative h-full w-full rounded-lg bg-white p-6 shadow-xl">
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
        <div className="mb-4 w-full rounded-md">
          <Uploader
            id={question.id}
            defaultValue={image}
            name="image1"
            upload={handleImageChange}
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
              className="cursor-pointer border-2 text-xl font-semibold text-gray-800"
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
            disabled={false}
          />
        </div>

        {/* Save Button */}
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
          <label htmlFor="correctAnswer" className="text-center">
            Correct Answer:
          </label>
          <input
            type="text"
            value={question.correctAnswer || editedCorrectAnswer}
            onChange={handleCorrectAnswerInputChange}
            onBlur={() => handleInputBlur("correctAnswer", editedCorrectAnswer)}
            placeholder="Correct Answer"
            autoFocus
            className="mt-1 block w-full rounded-md border border-stone-200 text-center dark:border-stone-700"
          />
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
