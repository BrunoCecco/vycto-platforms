"use client";
import { updateQuestionMetadata } from "@/lib/actions";
import { SelectQuestion } from "@/lib/schema";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@nextui-org/react";
import Uploader from "../form/uploader";
import PointsBadge from "../competitions/pointsBadge";
import { Button } from "@nextui-org/react";
import Form from "../form";

const EditGeneralNumber = ({
  question,
  removeQuestion,
}: {
  question: SelectQuestion;
  removeQuestion: (id: string) => void;
}) => {
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(
    question.question || "Edit your question here",
  );
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(
    question.correctAnswer || "",
  );
  const [points, setPoints] = useState(question.points || 0);
  const [image, setImage] = useState(question.image1 || "/placeholder.png");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateQuestion = async (key: string, value: string) => {
    if (!mounted) return;
    const formData = new FormData();
    formData.append(key, value);
    console.log("formData", key, value);
    const res = await updateQuestionMetadata(formData, question, key);
    toast.success("Question updated successfully");
    return res;
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
    console.log("handleInputBlur", key, value);
    setIsEditingPoints(false);
    await updateQuestion(key, value);
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this question?")) return;
    removeQuestion(question.id);
  };

  const handleImageChange = async (
    formData: FormData,
    id: string,
    name: string,
  ) => {
    const key = name;
    const value = formData.get(name) as string;
    console.log("handleImageChange", key, value);
    setImage(value);
    const res = await updateQuestion(key, value);
    return res;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="i relative h-full w-full rounded-lg  p-6 shadow-xl">
        {/* Remove Button */}
        <Button
          onClick={handleRemove}
          className="absolute left-2 top-2 rounded-full p-2 text-danger-500 hover:text-danger-600 focus:outline-none"
        >
          <X className="h-6 w-6" />
        </Button>
        {/* Editable Points Badge */}
        <div className="mb-4 flex justify-center">
          {isEditingPoints ? (
            <Input
              type="number"
              min={0}
              value={points.toString()}
              onChange={handlePointsInputChange}
              onBlur={() => handleInputBlur("points", points.toString())}
              className="w-20 text-center text-xl font-semibold "
            />
          ) : (
            <div className="cursor-pointer" onClick={handlePointsClick}>
              <PointsBadge points={points} />
            </div>
          )}
        </div>

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 w-full rounded-md">
          <Form
            title=""
            description=""
            helpText=""
            inputAttrs={{
              name: "image1",
              type: "file",
              defaultValue: image,
              placeholder: "image general number",
            }}
            handleSubmit={handleImageChange}
          />
        </div>

        {/* Editable Question */}
        <div className="mb-1 text-center">
          <Input
            type="text"
            value={editedQuestion}
            onChange={handleQuestionInputChange}
            onBlur={() => handleInputBlur("question", editedQuestion)}
          />
        </div>

        {/* Save Button */}
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
          <Input
            type="number"
            min={0}
            value={editedCorrectAnswer}
            onChange={handleCorrectAnswerInputChange}
            onBlur={() =>
              handleInputBlur("correctAnswer", editedCorrectAnswer.toString())
            }
            placeholder="Correct Answer"
          />
        </div>
      </div>
    </div>
  );
};

export default EditGeneralNumber;
