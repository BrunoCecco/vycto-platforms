"use client";
import { useEffect, useRef, useState } from "react";
import EditPlayerSelection from "@/components/edit-questions/editPlayerSelection";
import EditWhatMinute from "@/components/edit-questions/editWhatMinute";
import { createQuestion, deleteQuestion } from "@/lib/actions";
import { QuestionType } from "@/lib/types";
import { SelectQuestion } from "@/lib/schema";
import EditMatchOutcome from "@/components/edit-questions/editMatchOutcome";
import EditGuessScore from "@/components/edit-questions/editGuessScore";
import EditGeneralSelection from "@/components/edit-questions/editGeneralSelection";
import EditTrueFalse from "@/components/edit-questions/editTrueFalse";
import EditGeneralNumber from "@/components/edit-questions/editGeneralNumber";
import { toast } from "sonner";
import Button from "@/components/buttons/button";
import { getQuestionsForCompetition } from "@/lib/fetchers";

const QuestionBuilder = ({
  competitionId,
  initialQuestions,
}: {
  competitionId: string;
  initialQuestions: SelectQuestion[];
}) => {
  const [questions, setQuestions] = useState<SelectQuestion[]>([]);
  const [showOptionsIndex, setShowOptionsIndex] = useState<number | null>(null);
  const questionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      console.log("fetching questions");
      const qs = await getQuestionsForCompetition(competitionId);
      console.log("qs", qs);
      setQuestions(qs);
    };
    fetchQuestions();
  }, [competitionId]);

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
    toast.success("Question deleted successfully");
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

    setQuestions([...questions, question]);

    window.scrollTo({
      left: 0,
      top: (questionsRef.current?.getBoundingClientRect().bottom || 0) + 100,
      behavior: "smooth",
    });
  };

  const renderAddButton = (index: number | null) => (
    <div className="flex justify-center">
      <Button
        onClick={() =>
          setShowOptionsIndex(showOptionsIndex === index ? null : index)
        }
        className="flex items-center justify-center rounded-full bg-blue-500 px-4 py-2  hover:bg-blue-600"
      >
        {showOptionsIndex === index ? "Cancel" : "Add Question"}
      </Button>
      {showOptionsIndex === index && (
        <div className="absolute z-10 mt-10 w-72 rounded-lg bg-white">
          <Button
            onClick={() => handleAddQuestion(QuestionType.GeneralNumber, index)}
            className="block w-full px-4 py-2 text-left "
          >
            Add General Number Question
          </Button>
          <Button
            onClick={() =>
              handleAddQuestion(QuestionType.PlayerSelection, index)
            }
            className="block w-full px-4 py-2 text-left "
          >
            Add Player Selection Question
          </Button>
          <Button
            onClick={() => handleAddQuestion(QuestionType.WhatMinute, index)}
            className="block w-full px-4 py-2 text-left "
          >
            Add What Minute Question
          </Button>
          <Button
            onClick={() => handleAddQuestion(QuestionType.MatchOutcome, index)}
            className="block w-full px-4 py-2 text-left "
          >
            Add Match Outcome Question
          </Button>
          <Button
            onClick={() => handleAddQuestion(QuestionType.GuessScore, index)}
            className="block w-full px-4 py-2 text-left "
          >
            Add Guess Score Question
          </Button>
          <Button
            onClick={() =>
              handleAddQuestion(QuestionType.GeneralSelection, index)
            }
            className="block w-full px-4 py-2 text-left "
          >
            Add Player Goals Question
          </Button>
          <Button
            onClick={() => handleAddQuestion(QuestionType.TrueFalse, index)}
            className="block w-full px-4 py-2 text-left "
          >
            Add True/False Question
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4" ref={questionsRef}>
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
