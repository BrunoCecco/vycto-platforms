"use client";
import { answerQuestion } from "@/lib/actions";
import { Input } from "@nextui-org/react";
import { toast } from "sonner";

const Submit = ({
  userId,
  questionId,
  competitionId,
  answer,
  onLocalAnswer,
  children,
}: {
  userId: string | null;
  questionId: string;
  competitionId: string;
  answer: string | null;
  onLocalAnswer?: (questionId: string, answer: string) => void;
  children: React.ReactNode;
}) => {
  const handleSubmit = async (data: FormData) => {
    if (userId) {
      await answerQuestion(data);
    } else if (answer && onLocalAnswer) {
      onLocalAnswer(questionId, answer);
    }
  };

  return (
    <form
      className="flex items-center justify-center"
      action={handleSubmit}
      id={questionId}
      key={questionId}
    >
      {userId && <input type="hidden" hidden name="userId" value={userId} />}
      <input type="hidden" hidden name="questionId" value={questionId} />
      <input type="hidden" hidden name="competitionId" value={competitionId} />
      <input type="hidden" hidden name="answer" value={answer || ""} />
      {children}
    </form>
  );
};

export default Submit;
