"use client";
import Image from "next/image";
import { FC, useEffect } from "react";
import { useState } from "react";
import PointsBadge from "../competitions/pointsBadge";
import { answerQuestion } from "@/lib/actions";
import Submit from "./submit";
import QuestionResultBlock from "../competitions/questionResultBlock";
import { WideImage } from "./wideImage";
import { Button } from "@nextui-org/react";
import { TextGenerateEffect } from "../ui/textGenerateEffect";
import { makeTransparent } from "@/lib/utils";
import { SelectAnswer, SelectQuestion } from "@/lib/schema";
import { IQuestionProps } from "@/lib/types";

const GeneralSelection = ({ ...props }: IQuestionProps) => {
  const [selectedOption, setSelectedOption] = useState(
    props.answer?.answer || "",
  );
  const goalOptions = [];
  if (props.answer1 && props.answer1 != "") goalOptions.push(props.answer1);
  if (props.answer2 && props.answer2 != "") goalOptions.push(props.answer2);
  if (props.answer3 && props.answer3 != "") goalOptions.push(props.answer3);
  if (props.answer4 && props.answer4 != "") goalOptions.push(props.answer4);

  useEffect(() => {
    const updateAnswer = async () => {
      if (props.answer && "questionId" in props.answer) {
        const formData = new FormData();
        formData.append("answer", selectedOption);
        formData.append("questionId", props.answer?.questionId);
        formData.append("competitionId", props.competitionId);
        formData.append("userId", props.userId);
        await answerQuestion(formData);
      }
    };
    if (selectedOption != "") {
      updateAnswer();
    }
  }, [selectedOption]);

  return (
    <div className="flex w-full items-center">
      <div className="relative w-full rounded-lg p-4 shadow-xl">
        {/* Points Badge */}
        <PointsBadge points={props.points} color={props.color} />

        <WideImage src={props.image1} color={props.color} />

        <TextGenerateEffect words={props.question || ""} color={props.color} />
        <p className="text-center text-xs md:text-sm">
          Select correctly to score points
        </p>

        <div className="flex flex-col justify-center pt-3">
          <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-lg p-2">
            {goalOptions.map((option, index) => (
              <Submit
                key={"option" + index}
                userId={props.userId}
                competitionId={props.competitionId}
                questionId={props.id}
                answer={option}
                onLocalAnswer={props.onLocalAnswer}
              >
                <Button
                  isDisabled={props.disabled}
                  type="submit"
                  className={`w-max min-w-12 rounded-lg bg-content4 px-4 py-3 text-sm transition-all duration-200 ${
                    selectedOption === option ? "shadow-lg" : ""
                  } ${!props.disabled ? "hover:scale-105 hover:font-extrabold" : ""}`}
                  onClick={() => setSelectedOption(option)}
                  style={{
                    backgroundColor:
                      selectedOption === option
                        ? makeTransparent(props.color, 0.8)
                        : "",
                  }}
                >
                  {option}
                </Button>
              </Submit>
            ))}
          </div>
          {props.answer &&
          "points" in props.answer &&
          props.correctAnswer?.length &&
          props.correctAnswer?.length > 0 &&
          props.hasEnded ? (
            <QuestionResultBlock
              correctAnswer={props.correctAnswer}
              pointsEarned={parseFloat(props.answer?.points || "0").toFixed(2)}
              totalPoints={props.points?.toString()}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GeneralSelection;
