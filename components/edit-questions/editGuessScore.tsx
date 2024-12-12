"use client";
import { useEffect, useState } from "react";
import PointsBadge from "../competitions/pointsBadge";
import { PlusCircle, MinusCircle } from "lucide-react";
import { SelectQuestion } from "@/lib/schema";
import { updateQuestionMetadata } from "@/lib/actions";
import { toast } from "sonner";
import { Button, Input } from "@nextui-org/react";
import { X } from "lucide-react";
import EditQuestionHeader from "./editQuestionHeader";
import { QuestionType } from "@/lib/types";

const EditGuessScore = ({
  question,
  removeQuestion,
}: {
  question: SelectQuestion;
  removeQuestion: (id: string) => void;
}) => {
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
    const res = await updateQuestionMetadata(formData, question, key);
    toast.success("Question updated successfully");
    return res;
  };

  const handleInputBlur = async (key: string, value: string) => {
    const res = await updateQuestion(key, value);
    return res;
  };

  const handleCorrectAnswerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedCorrectAnswer(e.target.value);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg  p-4 shadow-xl md:p-10">
        <EditQuestionHeader
          type={question.type as QuestionType}
          question={question}
          removeQuestion={removeQuestion}
          updateQuestion={updateQuestion}
        />

        <h2 className="mb-12 text-xl font-semibold ">Guess the score 🔥</h2>

        {/* Teams */}
        <div className="flex w-full flex-col items-center justify-between gap-4 py-4 md:justify-around md:px-4">
          <div className="flex flex-col items-center gap-4 ">
            <div className="flex items-center gap-4 md:gap-8">
              <Button onClick={() => setScoreHome(Math.max(scoreHome - 1, 0))}>
                <MinusCircle />
              </Button>
              <div>{scoreHome}</div>
              <Button onClick={() => setScoreHome(scoreHome + 1)}>
                <PlusCircle />
              </Button>
            </div>
            <Input
              type="text"
              name="answer1"
              value={homeTeam}
              onValueChange={setHomeTeam}
              onBlur={() => handleInputBlur("answer1", homeTeam)}
            />
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="rounded-full border-2 border-blue-600 p-2 text-sm font-bold italic text-blue-600 md:text-xl">
              VS
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 ">
            <div className="flex items-center gap-4 md:gap-8">
              <Button onClick={() => setScoreAway(Math.max(scoreAway - 1, 0))}>
                <MinusCircle />
              </Button>
              <div>{scoreAway}</div>
              <Button onClick={() => setScoreAway(scoreAway + 1)}>
                <PlusCircle />
              </Button>
            </div>
            <Input
              type="text"
              name="answer2"
              value={awayTeam}
              onValueChange={setAwayTeam}
              onBlur={() => handleInputBlur("answer2", awayTeam)}
            />
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
