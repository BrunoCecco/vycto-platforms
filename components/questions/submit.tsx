"use client";
import { answerQuestion } from "@/lib/actions";

const Submit = ({
  userId,
  questionId,
  competitionId,
  answer,
  children,
}: {
  userId: string;
  questionId: string;
  competitionId: string;
  answer: string;
  children: React.ReactNode;
}) => {
  return (
    <form
      className="flex items-center justify-center"
      action={async (data: FormData) => {
        await answerQuestion(data);
      }}
    >
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="questionId" value={questionId} />
      <input type="hidden" name="competitionId" value={competitionId} />
      <input type="hidden" name="answer" value={answer} />
      {children}
    </form>
  );
};

export default Submit;
