"use client";
import { useState } from "react";
import Image from "next/image";
import PointsBadge from "../pointsBadge";
import { SelectQuestion } from "@/lib/schema";
import { updateQuestionMetadata } from "@/lib/actions";
import { toast } from "sonner";

const EditMatchOutcome = ({
  question,
  removeQuestion,
}: {
  question: SelectQuestion;
  removeQuestion: (id: string) => void;
}) => {
  const [isEditingHome, setIsEditingHome] = useState(false);
  const [isEditingAway, setIsEditingAway] = useState(false);
  const [isEditingPoints, setIsEditingPoints] = useState(false);

  const [homeTeam, setHomeTeam] = useState(question.answer1 || "Real Madrid");
  const [awayTeam, setAwayTeam] = useState(question.answer2 || "Chelsea");
  const [points, setPoints] = useState(question.points || 0);
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(
    question.correctAnswer || "",
  );

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(parseInt(e.target.value) || 0);
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this question?")) return;
    removeQuestion(question.id);
  };

  const updateQuestion = async (key: string, value: string) => {
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
              onBlur={() => handleInputBlur("points", points.toString())}
              autoFocus
              className="w-20 border-b-2 border-gray-300 text-center text-xl font-semibold text-gray-800"
            />
          ) : (
            <div onClick={() => setIsEditingPoints(true)}>
              <PointsBadge points={points} />
            </div>
          )}
        </div>

        {/* Match Info */}
        <h2 className="text-lg font-semibold text-gray-800 md:text-xl">
          {homeTeam} vs {awayTeam}
        </h2>
        <p className="text-sm text-gray-500">Pick the winner to score points</p>

        {/* Teams */}
        <div className="flex w-full items-center justify-between py-4 md:justify-around md:px-4">
          {/* Home Team */}
          <div className={`text-center`}>
            <div className="relative h-20 w-24 overflow-hidden rounded-lg border md:h-24 md:w-32">
              <Image
                src="/real-madrid.jpg" // Replace with the appropriate image path
                alt={homeTeam}
                layout="fill"
                objectFit="cover"
              />
            </div>
            {isEditingHome ? (
              <input
                type="text"
                name="answer1"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                onBlur={() => handleInputBlur("answer1", homeTeam)}
                autoFocus
                className="border-b-2 border-gray-300 text-center text-sm font-semibold text-gray-800"
              />
            ) : (
              <p
                className="cursor-pointer border-2 text-sm font-semibold text-gray-700"
                onClick={() => setIsEditingHome(true)}
              >
                {homeTeam}
              </p>
            )}
            <p className="text-xs text-gray-500">Home Team</p>{" "}
            {/* Add dynamic position if needed */}
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="rounded-full border-2 border-blue-600 p-2 text-sm font-bold italic text-blue-600 md:text-xl">
              VS
            </div>
          </div>

          {/* Away Team */}
          <div className={`text-center`}>
            <div className="relative h-20 w-24 overflow-hidden rounded-lg border md:h-24 md:w-32">
              <Image
                src="/chelsea.jpg" // Replace with the appropriate image path
                alt={awayTeam}
                layout="fill"
                objectFit="cover"
              />
            </div>
            {isEditingAway ? (
              <input
                type="text"
                name="answer2"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                onBlur={() => handleInputBlur("answer2", awayTeam)}
                autoFocus
                className="border-b-2 border-gray-300 text-center text-sm font-semibold text-gray-800"
              />
            ) : (
              <p
                className="cursor-pointer border-2 text-sm font-semibold text-gray-700"
                onClick={() => setIsEditingAway(true)}
              >
                {awayTeam}
              </p>
            )}
            <p className="text-xs text-gray-500">Away Team</p>{" "}
            {/* Add dynamic position if needed */}
          </div>
        </div>

        {/* Draw Button */}
        <div className="flex justify-center">
          <div
            className={`w-24 rounded-full border-2 border-blue-600 bg-white p-2 text-center text-sm font-semibold text-blue-600`}
          >
            Draw
          </div>
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
            placeholder="Chelsea"
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

export default EditMatchOutcome;
