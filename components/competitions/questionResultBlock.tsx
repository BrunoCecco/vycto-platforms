import React from "react";

interface QuestionResultBlockProps {
  correctAnswer: any;
  pointsEarned: any;
  totalPoints: any;
}

const QuestionResultBlock: React.FC<QuestionResultBlockProps> = ({
  correctAnswer,
  pointsEarned,
  totalPoints,
}) => {
  return (
    <div className="flex items-center justify-center pt-6">
      <div className="sm:text-md w-1/2 rounded-lg border border-success-600 p-2 text-center text-xs shadow-md sm:p-4">
        <div className="mb-2">
          Correct answer: <br className="block sm:hidden" />{" "}
          <span className="font-semibold">{correctAnswer}</span>
        </div>
        <div>
          <span className="font-semibold text-success-600">{pointsEarned}</span>
          /{totalPoints} points
        </div>
      </div>
    </div>
  );
};

export default QuestionResultBlock;
