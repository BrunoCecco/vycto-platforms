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
    <div className="flex items-center justify-center pt-6 ">
      <div className="w-1/2 rounded-lg border border-success-600 p-4 text-center shadow-md">
        <div className="mb-2">
          Correct answer:{" "}
          <span className="font-semibold ">{correctAnswer}</span>
        </div>
        <div>
          Points earned:{" "}
          <span className="font-semibold text-success-600">{pointsEarned}</span>
          /{totalPoints}
        </div>
      </div>
    </div>
  );
};

export default QuestionResultBlock;
