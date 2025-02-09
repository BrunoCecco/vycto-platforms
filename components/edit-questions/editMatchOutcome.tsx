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
import { nanoid } from "nanoid";
import { QuestionType } from "@/lib/types";
import EditQuestionHeader from "./editQuestionHeader";

const EditMatchOutcome = ({
  question,
  removeQuestion,
}: {
  question: SelectQuestion;
  removeQuestion: (id: string) => void;
}) => {
  const [homeTeam, setHomeTeam] = useState(question.answer1 || "Real Madrid");
  const [awayTeam, setAwayTeam] = useState(question.answer2 || "Chelsea");
  const [points, setPoints] = useState(question.points || 0);
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(
    question.correctAnswer || "",
  );
  const [image1, setImage1] = useState(question.image1 || "/placeholder.png");
  const [image2, setImage2] = useState(question.image2 || "/placeholder.png");

  const updateQuestion = async (key: string, value: string) => {
    const formData = new FormData();
    formData.append(key, value);
    console.log("formData", key, value);
    const res = await updateQuestionMetadata(formData, question, key);
    toast.success("Question updated successfully");
    return res;
  };

  const handleInputBlur = async (key: string, value: string) => {
    await updateQuestion(key, value);
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
        <EditQuestionHeader
          type={question.type as QuestionType}
          question={question}
          removeQuestion={removeQuestion}
          updateQuestion={updateQuestion}
        />

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
                  placeholder: nanoid(),
                }}
                handleSubmit={handleImage1Change}
                bordered={false}
              />
            </div>
            <Input
              type="text"
              name="answer1"
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              onBlur={() => handleInputBlur("answer1", homeTeam)}
            />
            <p className="text-xs ">Home Team</p>{" "}
            {/* Add dynamic position if needed */}
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="border-blue-600 text-blue-600 rounded-full border-2 p-2 text-sm font-bold italic md:text-xl">
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
                  placeholder: nanoid(),
                }}
                handleSubmit={handleImage2Change}
                bordered={false}
              />
            </div>
            <Input
              type="text"
              name="answer2"
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              onBlur={() => handleInputBlur("answer2", awayTeam)}
            />
            <p className="text-xs ">Away Team</p>{" "}
            {/* Add dynamic position if needed */}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
          {/* select element to edit the correct answer */}
          <Select
            value={editedCorrectAnswer}
            defaultSelectedKeys={[editedCorrectAnswer]}
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
