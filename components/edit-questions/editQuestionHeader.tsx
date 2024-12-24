"use client";
import { updateQuestionMetadata } from "@/lib/actions";
import { SelectQuestion } from "@/lib/schema";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@nextui-org/react";
import Uploader from "../form/uploader";
import PointsBadge from "../competitions/pointsBadge";
import { Button } from "@nextui-org/react";
import Form from "../form";
import { nanoid } from "nanoid";
import { QuestionType } from "@/lib/types";

const EditQuestionHeader = ({
  type,
  question,
  removeQuestion,
  updateQuestion,
}: {
  type: QuestionType | null;
  question: SelectQuestion;
  removeQuestion: (id: string) => void;
  updateQuestion: (key: string, value: string) => void;
}) => {
  const [points, setPoints] = useState(question?.points || 0);

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this question?")) return;
    removeQuestion(question?.id);
  };

  const handlePointsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(Number(e.target.value));
  };

  const handleInputBlur = async (key: string, value: string) => {
    console.log("handleInputBlur", key, value);
    await updateQuestion(key, value);
  };

  return (
    <div className="relative mb-2 flex items-center justify-between gap-2">
      {/* Remove Button */}
      <Button
        onClick={handleRemove}
        className="!min-w-0 border-none p-2 text-danger"
      >
        <X className="h-6 w-6" />
      </Button>
      <div>{type} question</div>
      <Input
        type="number"
        label="Points"
        min={0}
        value={points.toString()}
        onChange={handlePointsInputChange}
        onBlur={() => handleInputBlur("points", points.toString())}
        className="w-20 text-center text-xl font-semibold "
      />
    </div>
  );
};

export default EditQuestionHeader;
