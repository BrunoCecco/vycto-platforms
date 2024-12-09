"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import PointsBadge from "../competitions/pointsBadge";
import { SelectQuestion } from "@/lib/schema";
import { updateQuestionMetadata } from "@/lib/actions";
import { toast } from "sonner";
import Uploader from "../form/uploader";
import { X } from "lucide-react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import Form from "../form";

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
    const res = await updateQuestionMetadata(formData, question, key);
    toast.success("Question updated successfully");
    return res;
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

  const handleImage1Change = async (
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

  const handleImage2Change = async (
    formData: FormData,
    id: string,
    name: string,
  ) => {
    const key = name;
    const value = formData.get(name) as string;
    setImage2(value);
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
        <div className="mb-4 flex justify-center">
          {isEditingPoints ? (
            <Input
              type="number"
              min={0}
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
              <Form
                title=""
                description=""
                helpText=""
                inputAttrs={{
                  name: "image1",
                  type: "file",
                  defaultValue: image1,
                  placeholder: "image 1 match outcome",
                }}
                handleSubmit={handleImage1Change}
              />
            </div>
            {isEditingHome ? (
              <Input
                type="text"
                name="answer1"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                onBlur={() => handleInputBlur("answer1", homeTeam)}
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
              <Form
                title=""
                description=""
                helpText=""
                inputAttrs={{
                  name: "image2",
                  type: "file",
                  defaultValue: image2,
                  placeholder: "image 2 match outcome",
                }}
                handleSubmit={handleImage2Change}
              />
            </div>
            {isEditingAway ? (
              <Input
                type="text"
                name="answer2"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                onBlur={() => handleInputBlur("answer2", awayTeam)}
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
          <Select
            value={editedCorrectAnswer}
            onChange={async (e) => {
              setEditedCorrectAnswer(e.target.value);
              handleInputBlur("correctAnswer", e.target.value);
            }}
          >
            <SelectItem key={homeTeam}>{homeTeam}</SelectItem>
            <SelectItem key={awayTeam}>{awayTeam}</SelectItem>
            <SelectItem key="Draw">Draw</SelectItem>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default EditMatchOutcome;
