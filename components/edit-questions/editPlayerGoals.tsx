"use client";
import { useState } from "react";
import PointsBadge from "../pointsBadge";
import GoalSelector from "../goalSelector";

const EditPlayerGoals = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [question, setQuestion] = useState(
    "How many goals will the player score?",
  );
  const [points, setPoints] = useState(0);
  const [options, setOptions] = useState([
    "0 goals",
    "1 goal",
    "2 goals",
    "Hattrick!",
  ]);
  const [newOption, setNewOption] = useState("");

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(parseInt(e.target.value) || 0);
  };

  const handleOptionChange = (index: number, value: string) => {
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
    // removeQuestion(question.id);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:p-10">
        {/* Editable Points Badge */}
        <div className="mb-4 flex justify-center">
          {isEditingPoints ? (
            <input
              type="number"
              value={points}
              onChange={handlePointsChange}
              onBlur={() => setIsEditingPoints(false)}
              autoFocus
              className="w-20 border-b-2 border-gray-300 text-center text-xl font-semibold text-gray-800"
            />
          ) : (
            <div onClick={() => setIsEditingPoints(true)}>
              <PointsBadge points={points} />
            </div>
          )}
        </div>

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 h-32 w-full overflow-hidden rounded-lg bg-green-100">
          {/* Placeholder for the image */}
        </div>

        {/* Editable Question */}
        <div className="mb-1 text-center">
          {isEditingQuestion ? (
            <input
              type="text"
              value={question}
              onChange={handleQuestionChange}
              onBlur={() => setIsEditingQuestion(false)}
              autoFocus
              className="w-full border-b-2 border-gray-300 text-center text-xl font-semibold text-gray-800"
            />
          ) : (
            <h2
              className="cursor-pointer border-2 text-xl font-semibold text-gray-800"
              onClick={() => setIsEditingQuestion(true)}
            >
              {question}
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
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
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
        </div>

        {/* Save Button */}
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
          <label htmlFor="correctAnswer" className="text-center">
            Correct Answer:
          </label>
          <input
            type="text"
            placeholder="2 goals"
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

export default EditPlayerGoals;
