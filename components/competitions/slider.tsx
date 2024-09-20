"use client";
import { useState, FC, useRef, useEffect } from "react";
import { answerQuestion } from "@/lib/actions";
import { toast } from "sonner";

const Slider: FC<{
  userId?: string;
  questionId: string;
  initialValue: string;
  competitionId?: string;
  disabled: boolean;
  onBlur?: (value: number) => void;
  onLocalAnswer?: (questionId: string, answer: string) => void;
}> = ({
  userId,
  questionId,
  initialValue,
  competitionId,
  disabled,
  onBlur,
  onLocalAnswer,
}) => {
  const [value, setValue] = useState(parseInt(initialValue) || 0);
  const MIN = 0;
  const MAX = 90;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value));
  };

  const handleBlur = async () => {
    if (onBlur) onBlur(value);
    if (!competitionId) return;

    if (userId) {
      const data = new FormData();
      data.append("userId", userId);
      data.append("questionId", questionId);
      data.append("answer", value.toString());
      data.append("competitionId", competitionId);
      await answerQuestion(data);
      toast.success("Answer saved!");
    } else if (onLocalAnswer) {
      onLocalAnswer(questionId, value.toString());
      toast.success("Answer saved locally!");
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="flex items-center justify-center space-x-4">
        <span className="text-sm text-gray-600">{MIN}</span>
        <div
          id={questionId}
          className="flex w-full flex-col items-center justify-center"
        >
          <div className="relative w-full">
            <input
              type="range"
              min="0"
              max="90"
              value={value}
              disabled={disabled}
              onChange={handleChange}
              onBlur={handleBlur}
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
        </div>
        <span className="text-sm font-bold text-black">{MAX}</span>
      </div>
    </div>
  );
};

export default Slider;
