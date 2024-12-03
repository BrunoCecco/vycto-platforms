"use client";
import { useEffect, useState } from "react";
import PointsBadge from "../competitions/pointsBadge";
import { SelectQuestion } from "@/lib/schema";
import { updateQuestionMetadata } from "@/lib/actions";
import { toast } from "sonner";
import Uploader from "../form/uploader";
import { Button, Input } from "@nextui-org/react";
import { Check, X } from "lucide-react";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!mounted) return;
    const formData = new FormData();
    formData.append(key, value);
    console.log("formData", key, value);
    await updateQuestionMetadata(formData, question, key);
    toast.success("Question updated successfully");
  };

  const handleInputBlur = async (key: string, value: string) => {
    setIsEditingPoints(false);
    await updateQuestion(key, value);
  };

  const handleCorrectAnswerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedCorrectAnswer(e.target.value);
  };

  const handleImageChange = async (key: string, value: string) => {
    setImage1(value);
    await updateQuestion(key, value);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg  p-4 shadow-xl md:p-10">
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
            <Input
              type="number"
              min={0}
              name="points"
              value={points.toString()}
              onChange={handlePointsChange}
              onBlur={() => handleInputBlur("points", points.toString())}
            />
          ) : (
            <div onClick={() => setIsEditingPoints(true)}>
              <PointsBadge points={points} />
            </div>
          )}
        </div>

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 h-auto w-full overflow-hidden rounded-lg ">
          <Uploader
            id={question.id}
            defaultValue={image1}
            name={"image1"}
            upload={handleImageChange}
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
                  className={`flex h-10 w-10 items-center justify-center rounded-md border hover:border-green-500 hover:text-green-500 focus:outline-none
                  ${editedCorrectAnswer == option ? "border-green-500 text-green-500" : ""}`}
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
