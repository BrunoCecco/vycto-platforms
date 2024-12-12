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
import { nanoid } from "nanoid";
import { QuestionType } from "@/lib/types";
import EditQuestionHeader from "./editQuestionHeader";

const EditQuestion = ({
  type,
  question,
  removeQuestion,
}: {
  type: QuestionType;
  question: SelectQuestion;
  removeQuestion: (id: string) => void;
}) => {
  const [editedQuestion, setEditedQuestion] = useState(
    question?.question || "Edit your question here",
  );
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(
    question?.correctAnswer || "",
  );
  const [points, setPoints] = useState(question?.points || 0);
  const [image, setImage] = useState(question?.image1 || "/placeholder.png");

  const updateQuestion = async (key: string, value: string) => {
    const formData = new FormData();
    formData.append(key, value);
    console.log("formData", key, value);
    const res = await updateQuestionMetadata(formData, question, key);
    toast.success("Question updated successfully");
    return res;
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
    await updateQuestion(key, value);
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this question?")) return;
    removeQuestion(question?.id);
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
      <div className="relative h-full w-full rounded-lg  p-6 shadow-xl">
        <EditQuestionHeader
          type={type}
          question={question}
          removeQuestion={removeQuestion}
          updateQuestion={updateQuestion}
        />

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
              placeholder: nanoid(),
            }}
            handleSubmit={handleImageChange}
            bordered={false}
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

export default EditQuestion;
