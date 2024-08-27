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
  const [values, setValues] = useState([parseInt(initialValue) || 0]);
  const MIN = 0;
  const MAX = 90;

  const handleChange = (newValues: number[]) => {
    console.log("New values:", newValues);
    setValues(newValues);
  };

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
              formData.append("answer1", values[0].toString());
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
            value={values[0]}
          />
          {/* <Range
            label={`${questionId}-range`}
            step={1}
            min={MIN}
            max={MAX}
            disabled={disabled}
            values={values}
            onChange={handleChange}
            onFinalChange={() => formRef.current?.requestSubmit()}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                key={questionId + "-track"}
                className="h-2 w-full rounded-full bg-gray-200"
                style={{ position: "relative" }}
              >
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{
                    position: "absolute",
                    left: "0",
                    right: `${100 - ((values[0] - MIN) / (MAX - MIN)) * 100}%`,
                  }}
                />
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                key={questionId + "-thumb"}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-gray-200 shadow-md"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="text-xs font-bold text-blue-600">
                  {values[0]}
                </span>
              </div>
            )}
          /> */}
        </form>
        <span className="text-sm font-bold text-black">{MAX}</span>
      </div>
    </div>
  );
};

export default Slider;
