"use client";
import { useState, FC, useRef, useEffect } from "react";
import { answerQuestion } from "@/lib/actions";
import { toast } from "sonner";
import { Input } from "@nextui-org/react";

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
        <div
          id={questionId}
          className="flex w-full flex-col items-center justify-center"
        >
          <div className="relative w-full">
            <Input
              type="range"
              min="0"
              max="90"
              startContent={<div className="">{MIN}</div>}
              endContent={<div className="relative">{MAX}</div>}
              value={value.toString()}
              disabled={disabled}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-3 w-full appearance-none"
            />
          </div>
        </div>
      </div>
      <div className="pointer-events-none mt-4 transform text-center text-lg font-extrabold ">
        {value}
      </div>
    </div>
  );
};

export default Slider;
