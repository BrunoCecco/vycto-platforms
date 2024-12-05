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
  answer: string;
  onLocalAnswer: (questionId: string, answer: string) => void;
  children: React.ReactNode;
}) => {
  const handleSubmit = async (data: FormData) => {
    if (userId) {
      await answerQuestion(data);
      toast.success("Answer updated!");
    } else {
      onLocalAnswer(questionId, answer);
      toast.success("Answer saved locally!");
    }
  };

  return (
    <form className="flex items-center justify-center" action={handleSubmit}>
      {userId && <Input hidden name="userId" value={userId} />}
      <Input hidden name="questionId" value={questionId} />
      <Input hidden name="competitionId" value={competitionId} />
      <Input hidden name="answer" value={answer} />
      {children}
    </form>
  );
};

export default Submit;
