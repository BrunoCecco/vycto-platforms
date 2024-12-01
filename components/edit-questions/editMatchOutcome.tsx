"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import PointsBadge from "../competitions/pointsBadge";
import { SelectQuestion } from "@/lib/schema";
import { updateQuestionMetadata } from "@/lib/actions";
import { toast } from "sonner";
import Uploader from "../form/uploader";
import { X } from "lucide-react";

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
  const [image1, setImage1] = useState(question.image1 || "/placeholder.png");
  const [image2, setImage2] = useState(question.image2 || "/placeholder.png");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(parseInt(e.target.value) || 0);
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

  const handleImage1Change = async (key: string, value: string) => {
    setImage1(value);
    await updateQuestion(key, value);
  };

  const handleImage2Change = async (key: string, value: string) => {
    setImage2(value);
    await updateQuestion(key, value);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:p-10">
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
              onChange={handlePointsChange}
              onBlur={() => handleInputBlur("points", points.toString())}
              className="w-20 border-b-2 border-gray-300 text-center text-xl font-semibold "
            />
          ) : (
            <div onClick={() => setIsEditingPoints(true)}>
              <PointsBadge points={points} />
            </div>
          )}
        </div>

        {/* Match Info */}
        <h2 className="text-lg font-semibold  md:text-xl">
          {homeTeam} vs {awayTeam}
        </h2>
        <p className="text-sm ">Pick the winner to score points</p>

        {/* Teams */}
        <div className="flex w-full flex-col items-center justify-between gap-4 py-4 md:justify-around md:px-4">
          {/* Home Team */}
          <div className={`w-full text-center`}>
            <div className="relative mb-2 h-auto w-full overflow-hidden rounded-lg md:h-auto md:w-full">
              <Uploader
                id={question.id}
                defaultValue={image1}
                name={"image1"}
                upload={handleImage1Change}
              />
            </div>
            {isEditingHome ? (
              <input
                type="text"
                name="answer1"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                onBlur={() => handleInputBlur("answer1", homeTeam)}
                className="border-b-2 border-gray-300 text-center text-sm font-semibold "
              />
            ) : (
              <p
                className="cursor-pointer border-2 text-sm font-semibold "
                onClick={() => setIsEditingHome(true)}
              >
                {homeTeam}
              </p>
            )}
            <p className="text-xs ">Home Team</p>{" "}
            {/* Add dynamic position if needed */}
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="rounded-full border-2 border-blue-600 p-2 text-sm font-bold italic text-blue-600 md:text-xl">
              VS
            </div>
          </div>

          {/* Away Team */}
          <div className={`w-full text-center`}>
            <div className="relative mb-2 h-auto w-full overflow-hidden rounded-lg md:h-full md:w-full">
              <Uploader
                id={question.id}
                defaultValue={image2}
                name={"image2"}
                upload={handleImage2Change}
              />
            </div>
            {isEditingAway ? (
              <input
                type="text"
                name="answer2"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                onBlur={() => handleInputBlur("answer2", awayTeam)}
                className="border-b-2 border-gray-300 text-center text-sm font-semibold "
              />
            ) : (
              <p
                className="cursor-pointer border-2 text-sm font-semibold "
                onClick={() => setIsEditingAway(true)}
              >
                {awayTeam}
              </p>
            )}
            <p className="text-xs ">Away Team</p>{" "}
            {/* Add dynamic position if needed */}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
          {/* select element to edit the correct answer */}
          <select
            value={editedCorrectAnswer}
            onChange={async (e) => {
              setEditedCorrectAnswer(e.target.value);
              handleInputBlur("correctAnswer", e.target.value);
            }}
            className="mt-1 block w-full rounded-md border border-stone-200 text-center dark:border-stone-700"
          >
            <option value={homeTeam}>{homeTeam}</option>
            <option value={awayTeam}>{awayTeam}</option>
            <option value="Draw">Draw</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EditMatchOutcome;
