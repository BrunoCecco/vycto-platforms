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

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--input-track-color",
      color || "#000",
    );
  }, []);

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
      <style>
        {`
          input[type="range"]::-webkit-slider-runnable-track {
            -webkit-appearance: none;
            appearance: none;
            height: 3px;
            background: ${color};
            background: -webkit-linear-gradient(
              left,
              ${color} 50%,
              ${color} 100%
            );
            background: linear-gradient(
              to right,
              ${color} 50%,
              ${color} 100%
            );
            filter: progid:DXImageTransform.Microsoft.gradient(
              startColorstr="${color}",
              endColorstr="${color}",
              GradientType=1
            );
          }

          input[type="range"]::-moz-range-track {
            -moz-appearance: none;
            appearance: none;
            height: 3px;
            background: ${color};
            background: -moz-linear-gradient(
              left,
              ${color} 50%,
              ${color} 100%
            );
            background: linear-gradient(
              to right,
              ${color} 50%,
              ${color} 100%
            );
            filter: progid:DXImageTransform.Microsoft.gradient(
              startColorstr="${color}",
              endColorstr="${color}",
              GradientType=1
            );
          }

          input[type="range"]::-ms-track {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            height: 3px;
            background: ${color};
            background: -moz-linear-gradient(
              left,
              ${color} 50%,
              ${color} 50%,
              ${color} 100%
            );
            background: -webkit-linear-gradient(
              left,
              ${color} 50%,
              ${color} 50%,
              ${color} 100%
            );
            background: linear-gradient(
              to right,
              ${color} 50%,
              ${color} 50%,
              ${color} 100%
            );
            filter: progid:DXImageTransform.Microsoft.gradient(
              startColorstr="${color}",
              endColorstr="${color}",
              GradientType=1
            );
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            border: 2px solid ${color};
            border-radius: 50%;
            height: 25px;
            width: 25px;
            position: relative;
            bottom: 12px;
            background: #222 center no-repeat;
            background-size: 100%;
            box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.4);
            cursor: grab;

            &:active {
              cursor: grabbing;
            }
          }

          input[type="range"]::-moz-range-thumb {
            -moz-appearance: none;
            appearance: none;
            border: 2px solid ${color};
            border-radius: 50%;
            height: 20px;
            width: 20px;
            position: relative;
            bottom: 8px;
            background: #222
              url("http://codemenatalie.com/wp-content/uploads/2019/09/slider-thumb.png")
              center no-repeat;
            background-size: 50%;
            box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.4);
            cursor: grab;

            &:active {
              cursor: grabbing;
            }
          }

          input[type="range"]::-ms-thumb {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            border: 2px solid ${color};
            border-radius: 50%;
            height: 20px;
            width: 20px;
            position: relative;
            bottom: 8px;
            background: #222
              url("http://codemenatalie.com/wp-content/uploads/2019/09/slider-thumb.png")
              center no-repeat;
            background-size: 50%;
            box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.4);
            cursor: grab;

            &:active {
              cursor: grabbing;
            }
          }
        `}
      </style>
      <div className="flex items-center justify-center space-x-4">
        <div
          id={questionId}
          className="flex w-full flex-col items-center justify-center"
        >
          <div className="relative w-full">
            {/* <input
              type="range"
              min={MIN}
              max={MAX}
              value={value}
              onChange={handleChange}
              disabled={disabled}
              className="h-3 w-full appearance-none text-xs sm:text-sm"
            /> */}
            <Input
              type="range"
              min="0"
              max="90"
              startContent={<div className="ml-2 mr-1">{MIN}</div>}
              endContent={<div className="relative ml-1">{MAX}</div>}
              defaultValue={initialValue || "0"}
              disabled={disabled}
              onChange={handleChange}
              onMouseUp={handleBlur}
              onDragEnd={handleBlur}
              onBlur={handleBlur}
              onFocusChange={(focused) => {
                if (!focused) handleBlur();
              }}
              className="h-3 w-full appearance-none text-xs sm:text-sm"
              classNames={{
                input: "appearance-none !px-0",
              }}
            />
            {/* <NextSlider
              className="sm:text-sm w-full text-xs"
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
