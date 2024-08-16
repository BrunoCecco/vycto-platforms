"use client";
import { useState } from "react";
import EditPlayerSelection from "./edit-questions/editPlayerSelection";
import EditWhatMinute from "./edit-questions/editWhatMinute";
import { createQuestion } from "@/lib/actions";
import { QuestionType } from "@/lib/types";
import { SelectQuestion } from "@/lib/schema";

const QuestionBuilder = ({ competitionId }: { competitionId: string }) => {
  const [questions, setQuestions] = useState<JSX.Element[]>([]);
  const [showOptionsIndex, setShowOptionsIndex] = useState<number | null>(null);

  const handleAddQuestion = async (
    questionType: QuestionType,
    index: number | null,
  ) => {
    setShowOptionsIndex(null);

    const question = await createQuestion({
      competitionId,
      type: questionType,
    });

    let newQuestion: JSX.Element;
    if (questionType === QuestionType.PlayerSelection) {
      newQuestion = (
        <EditPlayerSelection
          key={questions.length}
          question={question as SelectQuestion}
        />
      );
    } else if (questionType === QuestionType.WhatMinute) {
      newQuestion = (
        <EditWhatMinute
          key={questions.length}
          question={question as SelectQuestion}
        />
      );
    } else {
      return;
    }

    if (index === null) {
      setQuestions((prev) => [...prev, newQuestion]);
    } else {
      const newQuestions = [...questions];
      newQuestions.splice(index, 0, newQuestion);
      setQuestions(newQuestions);
    }
  };

  const renderAddButton = (index: number | null) => (
    <div className="flex justify-center p-8">
      <button
        onClick={() => setShowOptionsIndex(index)}
        className="flex items-center justify-center rounded-full bg-blue-500 p-4 text-white hover:bg-blue-600"
      >
        Add Question
      </button>
      {showOptionsIndex === index && (
        <div className="absolute z-10 mt-2 w-72 rounded-lg bg-white shadow-lg">
          <button
            onClick={() =>
              handleAddQuestion(QuestionType.PlayerSelection, index)
            }
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Add Player Selection Question
          </button>
          <button
            onClick={() => handleAddQuestion(QuestionType.WhatMinute, index)}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Add What Minute Question
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {renderAddButton(0)}
      {questions.map((QuestionComponent, index) => (
        <div key={index}>
          {QuestionComponent}
          {renderAddButton(index + 1)}
        </div>
      ))}
    </div>
  );
};

export default QuestionBuilder;
