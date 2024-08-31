"use client";
import { useState, FC, useRef } from "react";
import { Range } from "react-range";
import { answerQuestion, updateQuestionMetadata } from "@/lib/actions";
import { SelectQuestion } from "@/lib/schema";
import { toast } from "sonner";

const Slider = ({
  userId,
  questionId,
  initialValue,
  question,
  disabled,
}: {
  userId?: string;
  questionId: string;
  initialValue: string;
  question?: SelectQuestion;
  disabled: boolean;
}) => {
  console.log(initialValue, "initialValue");
  const [value, setValue] = useState(parseInt(initialValue) || 0);
  const MIN = 0;
  const MAX = 90;

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="w-full px-4 py-6">
      <div className="flex items-center justify-center space-x-4">
        <span className="text-sm text-gray-600">{MIN}</span>
        <form
          ref={formRef}
          id={questionId}
          className="flex w-full flex-col items-center justify-center"
          action={async (data: FormData) => {
            if (userId != undefined) {
              console.log("Answering question", data);
              await answerQuestion(data);
              toast.success("Answer saved!");
            } else {
              // editing question so we have to updatequestionmetadata
              console.log("Updating question metadata", data);
              const formData = new FormData();
              formData.append("answer1", value.toString());
              await updateQuestionMetadata(formData, question, "answer1");
              toast.success("Answer saved!");
            }
          }}
        >
          <input
            id={`${questionId}-userId`}
            type="hidden"
            name="userId"
            value={userId}
          />
          <input
            id={`${questionId}-questionId`}
            type="hidden"
            name="questionId"
            value={questionId}
          />
          <input
            id={`${questionId}-answer`}
            type="hidden"
            name="answer"
            value={value}
          />
          <div className="relative w-full">
            <input
              type="range"
              min="0"
              max="90"
              value={value}
              disabled={disabled}
              onChange={(e) => setValue(parseInt(e.target.value))}
              onBlur={() => {
                if (formRef.current) {
                  formRef.current.submit();
                }
              }}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
              style={{ backgroundSize: `${value}% 100%` }}
            />
            <div
              className="pointer-events-none absolute left-0 top-0 mt-8 -translate-x-1/2 transform text-center text-lg font-extrabold text-blue-500"
              style={{
                left: `calc(${value}% + 40px)`,
              }}
            >
              {value}
            </div>
          </div>
        </form>
        <span className="text-sm font-bold text-black">{MAX}</span>
      </div>
    </div>
  );
};

export default Slider;
