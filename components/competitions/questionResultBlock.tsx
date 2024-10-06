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
    <div className="flex items-center justify-center pt-6 text-black">
      <div className="w-1/2 rounded-lg border border-green-600 p-4 text-center shadow-md">
        <div className="mb-2">
          Correct answer:{" "}
          <span className="font-semibold text-gray-800">{correctAnswer}</span>
        </div>
        <div>
          Points earned:{" "}
          <span className="font-semibold text-green-600">{pointsEarned}</span>/
          {totalPoints}
        </div>
      </div>
    </div>
  );
};

export default QuestionResultBlock;
