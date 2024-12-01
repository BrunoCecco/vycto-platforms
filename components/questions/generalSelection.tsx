"use client";
import Image from "next/image";
import { FC, useEffect } from "react";
import { useState } from "react";
import PointsBadge from "../competitions/pointsBadge";
import { answerQuestion } from "@/lib/actions";
import Submit from "./submit";
import QuestionResultBlock from "../competitions/questionResultBlock";
import FlipText from "../ui/flipText";
import { WideImage } from "./wideImage";

const makeTransparent = (color: string, opacity: number) => {
  // color is a hex string
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const GeneralSelection = ({ ...props }) => {
  const [selectedOption, setSelectedOption] = useState(
    props.answer.answer || "",
  );
  const goalOptions = [];
  if (props.answer1 && props.answer1 != "") goalOptions.push(props.answer1);
  if (props.answer2 && props.answer2 != "") goalOptions.push(props.answer2);
  if (props.answer3 && props.answer3 != "") goalOptions.push(props.answer3);
  if (props.answer4 && props.answer4 != "") goalOptions.push(props.answer4);

  useEffect(() => {
    const updateAnswer = async () => {
      const formData = new FormData();
      formData.append("answer", selectedOption);
      formData.append("questionId", props.questionId);
      formData.append("competitionId", props.competitionId);
      formData.append("userId", props.userId);
      await answerQuestion(formData);
    };
    if (selectedOption != "") {
      updateAnswer();
    }
  }, [selectedOption]);

  return (
    <div className="flex w-full items-center">
      <div className="relative w-full rounded-lg p-4 shadow-xl md:p-10">
        {/* Points Badge */}
        <PointsBadge points={props.points} color={props.color} />

        <WideImage src={props.image1} color={props.color} />

        {/* Question */}
        <FlipText
          word={props.question}
          className="mb-1 text-center text-xl font-semibold "
        />
        <p className="text-center">Select correctly to score points</p>

        <div className="flex flex-col justify-center pt-3">
          <div className="bg-content2 flex w-full flex-wrap items-center justify-around rounded-lg p-2">
            {goalOptions.map((option, index) => (
              <Submit
                key={"option" + index}
                userId={props.userId}
                competitionId={props.competitionId}
                questionId={props.id}
                answer={option}
                onLocalAnswer={props.onLocalAnswer}
              >
                <button
                  disabled={props.disabled}
                  className={`w-max rounded-lg px-4 py-3 text-sm transition-all duration-200 ${
                    selectedOption === option ? "font-semibold shadow-md" : ""
                  } ${!props.disabled ? "hover:font-semibold hover:shadow-md" : ""}`}
                  onClick={() => setSelectedOption(option)}
                  style={{
                    backgroundColor:
                      selectedOption === option
                        ? makeTransparent(props.color, 0.8)
                        : "",
                  }}
                >
                  {option}
                </button>
              </Submit>
            ))}
          </div>
          {props.correctAnswer?.length > 0 ? (
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
