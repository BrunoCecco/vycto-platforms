"use client";
import { useEffect, useState } from "react";
import PointsBadge from "../pointsBadge";
import { PlusCircle, MinusCircle } from "lucide-react";
import { SelectQuestion } from "@/lib/schema";
import { updateQuestionMetadata } from "@/lib/actions";
import { toast } from "sonner";
import Input from "../input";
import { X } from "lucide-react";
import Button from "../button";

const EditGuessScore = ({
  question,
  removeQuestion,
}: {
  question: SelectQuestion;
  removeQuestion: (id: string) => void;
}) => {
  const [isEditingHome, setIsEditingHome] = useState(false);
  const [isEditingAway, setIsEditingAway] = useState(false);
  const [isEditingPoints, setIsEditingPoints] = useState(false);

  const [homeTeam, setHomeTeam] = useState(question.answer1 || "Home Team");
  const [awayTeam, setAwayTeam] = useState(question.answer2 || "Away Team");
  const [points, setPoints] = useState(question.points || 0);

  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(
    question.correctAnswer || "",
  );

  const [scoreHome, setScoreHome] = useState(
    parseInt(question.correctAnswer?.split("-")[0] || "0"),
  );
  const [scoreAway, setScoreAway] = useState(
    parseInt(question.correctAnswer?.split("-")[1] || "0"),
  );

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
              name="points"
              min={0}
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

        <h2 className="mb-12 text-xl font-semibold text-gray-800">
          Guess the score 🔥
        </h2>

        {/* Teams */}
        <div className="flex w-full items-center justify-between gap-4 py-4 md:justify-around md:px-4">
          <div className="flex flex-col items-center gap-4 text-gray-500">
            <div className="flex items-center gap-4 md:gap-8">
              <button onClick={() => setScoreHome(Math.max(scoreHome - 1, 0))}>
                <MinusCircle />
              </button>
              <div>{scoreHome}</div>
              <button onClick={() => setScoreHome(scoreHome + 1)}>
                <PlusCircle />
              </button>
            </div>
            {isEditingHome ? (
              <Input
                type="text"
                name="answer1"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                onBlur={() => handleInputBlur("answer1", homeTeam)}
                className="border-b-2 border-gray-300 text-center text-sm font-semibold text-gray-800"
              />
            ) : (
              <p
                className="cursor-pointer border-2 text-sm font-semibold"
                onClick={() => setIsEditingHome(true)}
              >
                {homeTeam}
              </p>
            )}
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="rounded-full border-2 border-blue-600 p-2 text-sm font-bold italic text-blue-600 md:text-xl">
              VS
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 text-gray-500">
            <div className="flex items-center gap-4 md:gap-8">
              <button onClick={() => setScoreAway(Math.max(scoreAway - 1, 0))}>
                <MinusCircle />
              </button>
              <div>{scoreAway}</div>
              <button onClick={() => setScoreAway(scoreAway + 1)}>
                <PlusCircle />
              </button>
            </div>
            {isEditingAway ? (
              <Input
                type="text"
                name="answer2"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                onBlur={() => handleInputBlur("answer2", awayTeam)}
                className="border-b-2 border-gray-300 text-center text-sm font-semibold text-gray-800"
              />
            ) : (
              <p
                className="cursor-pointer border-2 text-sm font-semibold"
                onClick={() => setIsEditingAway(true)}
              >
                {awayTeam}
              </p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
          <Button
            onClick={async () => {
              setEditedCorrectAnswer(`${scoreHome}-${scoreAway}`);
              await updateQuestion(
                "correctAnswer",
                `${scoreHome}-${scoreAway}`,
              );
            }}
          >
            Update Correct Answer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditGuessScore;
