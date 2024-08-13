"use client";
import { answerQuestion } from "@/lib/actions";

const SubmitButton = ({
  userId,
  questionId,
  answer,
  selected,
}: {
  userId: string;
  questionId: string;
  answer: string;
  selected: boolean;
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
      <input type="hidden" name="answer" value={answer} />
      <button
        type="submit"
        className="w-24 rounded-full border-2 border-blue-600 bg-white p-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
        style={{
          backgroundColor: selected ? "blue" : "white",
          color: selected ? "white" : "blue",
        }}
      >
        {answer}
      </button>
    </form>
  );
};

export default SubmitButton;
