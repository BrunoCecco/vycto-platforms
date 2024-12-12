"use client";
import { updateQuestionMetadata } from "@/lib/actions";
import { SelectQuestion } from "@/lib/schema";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Uploader from "../form/uploader";
import PointsBadge from "../competitions/pointsBadge";
import { Input } from "@nextui-org/react";
import { X } from "lucide-react";
import { Button } from "@nextui-org/react";
import Form from "../form";
import { nanoid } from "nanoid";
import EditQuestionHeader from "./editQuestionHeader";
import { QuestionType } from "@/lib/types";

const TFButton = ({
  children,
  selected,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="submit"
      className="w-24 rounded-full border-2 border-blue-600  p-2 text-sm font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:opacity-75"
      style={{
        backgroundColor: selected ? "blue" : "white",
        color: selected ? "white" : "blue",
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const EditTrueFalse = ({
  question,
  removeQuestion,
}: {
  question: SelectQuestion;
  removeQuestion: (id: string) => void;
}) => {
  const [editedQuestion, setEditedQuestion] = useState(
    question.question || "Griezmann will score",
  );
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(
    question.correctAnswer || "",
  );
  const [points, setPoints] = useState(question.points || 0);
  const [image, setImage] = useState(question.image1 || "/placeholder.png");

  const updateQuestion = async (key: string, value: string) => {
    const formData = new FormData();
    formData.append(key, value);
    console.log("formData", key, value);
    const res = await updateQuestionMetadata(formData, question, key);
    toast.success(key + " updated successfully");
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
    setImage(value);
    const res = await updateQuestion(key, value);
    return res;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="i relative h-full w-full rounded-lg  p-6 shadow-xl">
        <EditQuestionHeader
          type={question.type as QuestionType}
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
        <p className="mb-4 text-center ">Select correctly to score points.</p>

        <div className="flex justify-around gap-4 text-center">
          <TFButton
            selected={editedCorrectAnswer == "True"}
            disabled={false}
            onClick={async () => {
              setEditedCorrectAnswer("True");
              handleInputBlur("correctAnswer", "True");
            }}
          >
            True
          </TFButton>
          <TFButton
            selected={editedCorrectAnswer == "False"}
            disabled={false}
            onClick={async () => {
              setEditedCorrectAnswer("False");
              handleInputBlur("correctAnswer", "False");
            }}
          >
            False
          </TFButton>
        </div>
      </div>
    </div>
  );
};

export default EditTrueFalse;
