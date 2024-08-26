"use client";
import { useEffect, useState } from "react";
import EditPlayerSelection from "./edit-questions/editPlayerSelection";
import EditWhatMinute from "./edit-questions/editWhatMinute";
import { createQuestion, deleteQuestion } from "@/lib/actions";
import { QuestionType } from "@/lib/types";
import { SelectQuestion } from "@/lib/schema";
import EditMatchOutcome from "./edit-questions/editMatchOutcome";
import EditGuessScore from "./edit-questions/editGuessScore";
import EditGeneralSelection from "./edit-questions/editGeneralSelection";
import EditTrueFalse from "./edit-questions/editTrueFalse";
import EditGeneralNumber from "./edit-questions/editGeneralNumber";

const QuestionBuilder = ({
  competitionId,
  initialQuestions,
}: {
  competitionId: string;
  initialQuestions: SelectQuestion[];
}) => {
  const [questions, setQuestions] = useState<SelectQuestion[]>(
    initialQuestions || [],
  );
  const [showOptionsIndex, setShowOptionsIndex] = useState<number | null>(null);

  const getQuestionElement = (question: SelectQuestion, type: QuestionType) => {
    switch (type) {
      case QuestionType.PlayerSelection:
        return (
          <EditPlayerSelection
            question={question}
            removeQuestion={handleRemoveQuestion}
          />
        );
      case QuestionType.WhatMinute:
        return (
          <EditWhatMinute
            question={question}
            removeQuestion={handleRemoveQuestion}
          />
        );
      case QuestionType.MatchOutcome:
        return (
          <EditMatchOutcome
            question={question}
            removeQuestion={handleRemoveQuestion}
          />
        );
      case QuestionType.GuessScore:
        return (
          <EditGuessScore
            question={question}
            removeQuestion={handleRemoveQuestion}
          />
        );
      case QuestionType.GeneralSelection:
        return (
          <EditGeneralSelection
            question={question}
            removeQuestion={handleRemoveQuestion}
          />
        );
      case QuestionType.TrueFalse:
        return (
          <EditTrueFalse
            question={question}
            removeQuestion={handleRemoveQuestion}
          />
        );
      case QuestionType.GeneralNumber:
        return (
          <EditGeneralNumber
            question={question}
            removeQuestion={handleRemoveQuestion}
          />
        );
      default:
        return;
    }
  };

  const handleRemoveQuestion = async (id: string) => {
    const newQuestions = [...initialQuestions];
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

    console.log("question", question);

    if (!question) return;

    setQuestions([question, ...questions]);
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
            onClick={() => handleAddQuestion(QuestionType.GeneralNumber, index)}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Add General Number Question
          </button>
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
            onClick={() =>
              handleAddQuestion(QuestionType.GeneralSelection, index)
            }
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
    <div className="flex flex-col gap-4">
      {renderAddButton(0)}
      {questions.map((question, index) => (
        <div key={index + "editable" + question.id} className="">
          {getQuestionElement(question, question.type as QuestionType)}
        </div>
      ))}
    </div>
  );
};

export default QuestionBuilder;
