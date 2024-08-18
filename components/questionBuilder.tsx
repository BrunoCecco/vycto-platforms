"use client";
import { useEffect, useState } from "react";
import EditPlayerSelection from "./edit-questions/editPlayerSelection";
import EditWhatMinute from "./edit-questions/editWhatMinute";
import { createQuestion, deleteQuestion } from "@/lib/actions";
import { QuestionType } from "@/lib/types";
import { SelectQuestion } from "@/lib/schema";
import EditMatchOutcome from "./edit-questions/editMatchOutcome";
import EditGuessScore from "./edit-questions/editGuessScore";
import EditPlayerGoals from "./edit-questions/editPlayerGoals";
import EditTrueFalse from "./edit-questions/editTrueFalse";

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
        return {
          id: question.id,
          type: question.type,
          element: getQuestionElement(question, question.type as QuestionType),
        };
      },
    );
    if (initialQuestionData && initialQuestionData.length > 0) {
      setQuestions(initialQuestionData as IQuestion[]);
    }
  }, [initialQuestions]);

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  const getQuestionElement = (question: SelectQuestion, type: QuestionType) => {
    switch (type) {
      case QuestionType.PlayerSelection:
        return (
          <EditPlayerSelection
            key={questions.length}
            question={question}
            removeQuestion={handleRemoveQuestion}
          />
        );
      case QuestionType.WhatMinute:
        return (
          <EditWhatMinute
            key={questions.length}
            question={question}
            removeQuestion={handleRemoveQuestion}
          />
        );
      case QuestionType.MatchOutcome:
        return (
          <EditMatchOutcome
            key={questions.length}
            question={question}
            removeQuestion={handleRemoveQuestion}
          />
        );
      case QuestionType.GuessScore:
        return (
          <EditGuessScore
            key={questions.length}
            question={question}
            removeQuestion={handleRemoveQuestion}
          />
        );
      case QuestionType.PlayerGoals:
        return (
          <EditPlayerGoals
            key={questions.length}
            question={question}
            removeQuestion={handleRemoveQuestion}
          />
        );
      case QuestionType.TrueFalse:
        return (
          <EditTrueFalse
            key={questions.length}
            question={question}
            removeQuestion={handleRemoveQuestion}
          />
        );
      default:
        return;
    }
  };

  const handleRemoveQuestion = async (id: string) => {
    const newQuestions = [...questions];
    const index = newQuestions.findIndex((question) => question.id === id);
    console.log("index", index);
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

    let newQuestion = getQuestionElement(question, questionType);
    if (!newQuestion) return;

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
    <div className="flex justify-center">
      <button
        onClick={() =>
          setShowOptionsIndex(showOptionsIndex === index ? null : index)
        }
        className="flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        {showOptionsIndex === index ? "Cancel" : "Add Question"}
      </button>
      {showOptionsIndex === index && (
        <div className="absolute z-10 mt-10 w-72 rounded-lg bg-white shadow-lg">
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
          <button
            onClick={() => handleAddQuestion(QuestionType.MatchOutcome, index)}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Add Match Outcome Question
          </button>
          <button
            onClick={() => handleAddQuestion(QuestionType.GuessScore, index)}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Add Guess Score Question
          </button>
          <button
            onClick={() => handleAddQuestion(QuestionType.PlayerGoals, index)}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Add Player Goals Question
          </button>
          <button
            onClick={() => handleAddQuestion(QuestionType.TrueFalse, index)}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Add True/False Question
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="">
      {renderAddButton(0)}
      {questions.map((question, index) => (
        <div key={index} className="flex flex-col gap-4">
          {question.element}
          {renderAddButton(index + 1)}
        </div>
      ))}
    </div>
  );
};

export default QuestionBuilder;
