"use client";
import { useEffect, useState } from "react";
import EditPlayerSelection from "./edit-questions/editPlayerSelection";
import EditWhatMinute from "./edit-questions/editWhatMinute";
import { createQuestion, deleteQuestion } from "@/lib/actions";
import { QuestionType } from "@/lib/types";
import { SelectQuestion } from "@/lib/schema";

interface IQuestion {
  id: string;
  type: QuestionType;
  element: JSX.Element;
}

const QuestionBuilder = ({
  competitionId,
  initialQuestions,
}: {
  competitionId: string;
  initialQuestions: SelectQuestion[];
}) => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [showOptionsIndex, setShowOptionsIndex] = useState<number | null>(null);

  useEffect(() => {
    const initialQuestionData = initialQuestions.map(
      (question: SelectQuestion, index: number) => {
        if (question.type === QuestionType.PlayerSelection) {
          return {
            id: question.id,
            type: question.type,
            element: (
              <EditPlayerSelection
                key={question.id}
                question={question as SelectQuestion}
                removeQuestion={handleRemoveQuestion}
              />
            ),
          };
        } else {
          return {
            id: question.id,
            type: question.type,
            element: (
              <EditWhatMinute
                key={question.id}
                question={question as SelectQuestion}
                removeQuestion={handleRemoveQuestion}
              />
            ),
          };
        }
      },
    );
    if (initialQuestionData && initialQuestionData.length > 0) {
      setQuestions(initialQuestionData as IQuestion[]);
    }
  }, [initialQuestions]);

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  const handleRemoveQuestion = async (id: string) => {
    const newQuestions = [...questions];
    const index = newQuestions.findIndex((question) => question.id === id);
    if (index === -1) return;
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);

    await deleteQuestion(id);
  };

  const handleAddQuestion = async (
    questionType: QuestionType,
    index: number | null,
  ) => {
    setShowOptionsIndex(null);

    const question = await createQuestion({
      competitionId,
      type: questionType,
    });

    if (!question) return;

    let newQuestion: JSX.Element;
    if (questionType === QuestionType.PlayerSelection) {
      newQuestion = (
        <EditPlayerSelection
          key={questions.length}
          question={question as SelectQuestion}
          removeQuestion={handleRemoveQuestion}
        />
      );
    } else if (questionType === QuestionType.WhatMinute) {
      newQuestion = (
        <EditWhatMinute
          key={questions.length}
          question={question as SelectQuestion}
          removeQuestion={handleRemoveQuestion}
        />
      );
    } else {
      return;
    }

    if (index === null) {
      setQuestions([
        ...questions,
        { id: question.id, type: questionType, element: newQuestion },
      ]);
    } else {
      const newQuestions = [...questions];
      newQuestions.splice(index, 0, {
        id: question.id,
        type: questionType,
        element: newQuestion,
      });
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
      {questions.map((question, index) => (
        <div key={index}>
          {question.element}
          {renderAddButton(index + 1)}
        </div>
      ))}
    </div>
  );
};

export default QuestionBuilder;
