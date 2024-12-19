"use client";
import { useState, FC, useRef, useEffect } from "react";
import { answerQuestion } from "@/lib/actions";
import { toast } from "sonner";
import { Input, Slider as NextSlider, SliderValue } from "@nextui-org/react";

const Slider: FC<{
  userId?: string;
  questionId: string;
  initialValue: string;
  competitionId?: string;
  disabled: boolean;
  color?: string;
  onBlur?: (value: number) => void;
  onLocalAnswer?: (questionId: string, answer: string) => void;
}> = ({
  userId,
  questionId,
  initialValue = "0",
  competitionId,
  disabled,
  color,
  onBlur,
  onLocalAnswer,
}) => {
  const [value, setValue] = useState(initialValue || "0");
  const MIN = 0;
  const MAX = 90;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = async () => {
    if (onBlur) onBlur(parseInt(value));
    if (!competitionId) return;

    if (userId) {
      const data = new FormData();
      data.append("userId", userId);
      data.append("questionId", questionId);
      data.append("answer", value);
      data.append("competitionId", competitionId);
      await answerQuestion(data);
      toast.success("Answer saved!");
    } else if (onLocalAnswer) {
      onLocalAnswer(questionId, value);
      toast.success("Answer saved locally!");
    }
  };

  return (
    <div className="w-full">
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
              startContent={<div className="ml-2">{MIN}</div>}
              endContent={<div className="relative">{MAX}</div>}
              value={initialValue}
              disabled={disabled}
              onChange={handleChange}
              onMouseUp={handleBlur}
              onDragEnd={handleBlur}
              className="sm:text-md h-3 w-full appearance-none text-xs"
            />
            {/* <NextSlider
              className="sm:text-md w-full text-xs"
              value={parseInt(value)}
              onChange={(value: SliderValue) => setValue(value.toString())}
              label="Minute"
              maxValue={90}
              minValue={0}
              onDragEnd={handleBlur}
              onMouseUp={handleBlur}
              // isDisabled={disabled}
              startContent={<div className="ml-2">{MIN}</div>}
              endContent={<div className="relative">{MAX}</div>}
              step={1}
              classNames={{
                base: "max-w-md gap-3",
                track: "border-s-secondary-100",
                filler: "bg-gradient-to-r from-secondary-100 to-secondary-500",
                label: "text-xs",
              }}
              showTooltip={true}
            /> */}
          </div>
        </div>
      </div>
      <div className="pointer-events-none mt-4 transform text-center text-xs font-extrabold sm:text-lg ">
        {value}
      </div>
    </div>
  );
};

export default Slider;
