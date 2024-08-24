"use client";
import { useEffect, useState } from "react";
import PointsBadge from "../pointsBadge";
import { SelectQuestion } from "@/lib/schema";
import { updateQuestionMetadata } from "@/lib/actions";
import { toast } from "sonner";
import Uploader from "../old-components/uploader";

const EditGeneralSelection = ({
  question,
  removeQuestion,
}: {
  question: SelectQuestion;
  removeQuestion: (id: string) => void;
}) => {
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(
    question.question || "How many goals will the player score?",
  );
  const [points, setPoints] = useState(question.points || 0);
  const [options, setOptions] = useState([
    question.answer1 || "0 goals",
    question.answer2 || "1 goal",
    question.answer3 || "2 goals",
    question.answer4 || "Hattrick!",
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

  const handleAddOption = () => {
    if (newOption.trim() !== "") {
      setOptions([...options, newOption]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
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
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:p-10">
        {/* Editable Points Badge */}
        <div className="mb-4 flex justify-center">
          {isEditingPoints ? (
            <input
              type="number"
              name="points"
              value={points}
              onChange={handlePointsChange}
              onBlur={() => handleInputBlur("points", points.toString())}
              className="w-20 border-b-2 border-gray-300 text-center text-xl font-semibold text-gray-800"
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
          {isEditingQuestion ? (
            <input
              type="text"
              name="question"
              value={editedQuestion}
              onChange={handleQuestionChange}
              onBlur={() => handleInputBlur("question", editedQuestion)}
              className="w-full border-b-2 border-gray-300 text-center text-xl font-semibold text-gray-800"
            />
          ) : (
            <h2
              className="cursor-pointer border-2 text-xl font-semibold text-gray-800"
              onClick={() => setIsEditingQuestion(true)}
            >
              {editedQuestion}
            </h2>
          )}
        </div>
        <p className="text-center text-gray-500">
          Select correctly to score points
        </p>

        {/* Editable GoalSelector Options */}
        <div className="flex flex-col items-center justify-center pt-3">
          {options.map((option, index) => (
            <div key={index} className="mb-2 flex items-center">
              <input
                type="text"
                name={"anwer" + (index + 1)}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                onBlur={() => handleInputBlur("answer" + (index + 1), option)}
                className="mr-2 border-b-2 border-gray-300 text-center"
              />
              <button
                onClick={() => handleRemoveOption(index)}
                className="ml-2 text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          {options?.length < 4 && (
            <div className="flex items-center">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add new option"
                className="mr-2 border-b-2 border-gray-300 text-center"
              />
              <button
                onClick={handleAddOption}
                className="ml-2 rounded bg-blue-500 px-2 py-1 text-white"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
          <label htmlFor="correctAnswer" className="text-center">
            Correct Answer:
          </label>
          <input
            type="text"
            value={editedCorrectAnswer}
            onChange={handleCorrectAnswerInputChange}
            onBlur={() => handleInputBlur("correctAnswer", editedCorrectAnswer)}
            placeholder="Correct Answer"
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

export default EditGeneralSelection;
