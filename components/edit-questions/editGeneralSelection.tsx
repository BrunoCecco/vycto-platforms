"use client";
import { useEffect, useState } from "react";
import PointsBadge from "../competitions/pointsBadge";
import { SelectQuestion } from "@/lib/schema";
import { updateQuestionMetadata } from "@/lib/actions";
import { toast } from "sonner";
import Uploader from "../form/uploader";
import { Button, Input } from "@nextui-org/react";
import { Check, X } from "lucide-react";
import Form from "../form";

const EditGeneralSelection = ({
  question,
  removeQuestion,
}: {
  question: SelectQuestion;
  removeQuestion: (id: string) => void;
}) => {
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(
    question.question || "How many goals will the player score?",
  );
  const [points, setPoints] = useState(question.points || 0);
  const [options, setOptions] = useState([
    question.answer1 || "",
    question.answer2 || "",
    question.answer3 || "",
    question.answer4 || "",
  ]);
  const [newOption, setNewOption] = useState("");
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(
    question.correctAnswer || "",
  );
  const [image1, setImage1] = useState(question.image1 || "/placeholder.png");

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedQuestion(e.target.value);
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(parseInt(e.target.value) || 0);
  };

  const handleOptionChange = async (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this question?")) return;
    removeQuestion(question.id);
  };

  const updateQuestion = async (key: string, value: string) => {
    const formData = new FormData();
    formData.append(key, value);
    console.log("formData", key, value);
    const res = await updateQuestionMetadata(formData, question, key);
    toast.success("Question updated successfully");
    return res;
  };

  const handleInputBlur = async (key: string, value: string) => {
    setIsEditingPoints(false);
    const res = await updateQuestion(key, value);
    return res;
  };

  const handleCorrectAnswerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedCorrectAnswer(e.target.value);
  };

  const handleImageChange = async (
    formData: FormData,
    id: string,
    name: string,
  ) => {
    const key = name;
    const value = formData.get(name) as string;
    setImage1(value);
    const res = await updateQuestion(key, value);
    return res;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg  p-4 shadow-xl md:p-10">
        {/* Remove Button */}
        <Button
          onClick={handleRemove}
          className="absolute left-2 top-2 rounded-full p-2 text-danger-500 hover:text-danger-600 focus:outline-none"
        >
          <X className="h-6 w-6" />
        </Button>
        {/* Editable Points Badge */}
        <div className="mb-4 ml-auto flex w-fit justify-center">
          <Input
            type="number"
            min={0}
            label="Points"
            name="points"
            value={points.toString()}
            onChange={handlePointsChange}
            onBlur={() => handleInputBlur("points", points.toString())}
          />
        </div>

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 h-auto w-full overflow-hidden rounded-lg ">
          <Form
            title=""
            description=""
            helpText=""
            inputAttrs={{
              name: "image1",
              type: "file",
              defaultValue: image1,
              placeholder: "image 1 general selection",
            }}
            handleSubmit={handleImageChange}
            bordered={false}
          />
        </div>

        {/* Editable Question */}
        <div className="mb-1 text-center">
          <Input
            type="text"
            name="question"
            value={editedQuestion}
            onChange={handleQuestionChange}
            onBlur={() => handleInputBlur("question", editedQuestion)}
          />
        </div>
        <p className="text-center ">Select correctly to score points</p>

        {/* Editable GoalSelector Options */}
        <div className="flex flex-col items-center justify-center pt-3">
          {options.map((option, index) => (
            <div key={index} className="mb-2 flex items-center">
              <Input
                type="text"
                name={"anwer" + (index + 1)}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                onBlur={() => handleInputBlur("answer" + (index + 1), option)}
              />
              {option?.length > 0 && (
                <Button
                  onClick={async () => {
                    setEditedCorrectAnswer(option);
                    handleInputBlur("correctAnswer", option);
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-md border hover:border-success-500 hover:text-success-500 focus:outline-none
                  ${editedCorrectAnswer == option ? "border-success-500 text-success-500" : ""}`}
                >
                  <Check />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditGeneralSelection;
