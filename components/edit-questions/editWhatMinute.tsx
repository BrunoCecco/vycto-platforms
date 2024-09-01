"use client";
import { updateQuestionMetadata } from "@/lib/actions";
import { SelectQuestion } from "@/lib/schema";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Uploader from "../old-components/uploader";
import PointsBadge from "../pointsBadge";
import Slider from "../slider";
import { X } from "lucide-react";
import Button from "../button";

const EditWhatMinute = ({
  question,
  removeQuestion,
}: {
  question: SelectQuestion;
  removeQuestion: (id: string) => void;
}) => {
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(
    question.question ?? "What minute?",
  );
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(
    question.correctAnswer ?? "",
  );
  const [points, setPoints] = useState(question.points ?? 0);
  const [image, setImage] = useState(question.image1 ?? "/placeholder.png");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateQuestion = async (key: string, value: string) => {
    if (!mounted) return;
    console.log("updateQuestion", key, value);
    const formData = new FormData();
    formData.append(key, value);
    await updateQuestionMetadata(formData, question, key);
    toast.success("Question updated successfully");
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
    setIsEditingPoints(false);
    await updateQuestion(key, value);
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this question?")) return;
    removeQuestion(question.id);
  };

  const handleImageChange = async (key: string, value: string) => {
    console.log("handleImageChange", key, value);
    setImage(value);
    await updateQuestion(key, value);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative h-full w-full rounded-lg bg-white p-6 shadow-xl">
        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="absolute left-2 top-2 rounded-full p-2 text-red-500 hover:text-red-600 focus:outline-none"
        >
          <X className="h-6 w-6" />
        </button>
        {/* Editable Points Badge */}
        <div className="mb-4 flex justify-center">
          {isEditingPoints ? (
            <input
              type="number"
              min={0}
              value={points}
              onChange={handlePointsInputChange}
              onBlur={() => handleInputBlur("points", points.toString())}
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
          <input
            type="text"
            value={editedQuestion}
            onChange={handleQuestionInputChange}
            onBlur={() => handleInputBlur("question", editedQuestion)}
            className="mt-1 block w-full rounded-md border border-stone-200 text-center dark:border-stone-700"
          />
        </div>
        <p className="text-center text-gray-500">
          The closer you get, the more points you score
        </p>

        <div className="flex flex-col items-center justify-center gap-4">
          <Slider
            initialValue={editedCorrectAnswer || "0"}
            questionId={question.id}
            disabled={false}
            onBlur={(val: number) => {
              setEditedCorrectAnswer(val.toString());
            }}
          />
          <Button
            onClick={async () =>
              handleInputBlur("correctAnswer", editedCorrectAnswer)
            }
          >
            Update Correct Answer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditWhatMinute;
