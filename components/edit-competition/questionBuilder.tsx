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
import { getQuestionsForCompetition } from "@/lib/fetchers";
import { Button, Spinner } from "@nextui-org/react";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      console.log("fetching questions");
      const qs = await getQuestionsForCompetition(competitionId);
      setQuestions(
        qs.sort((a: SelectQuestion, b: SelectQuestion) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }),
      );
      setLoading(false);
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
    setLoading(true);
    const newQuestions = [...initialQuestions];
    const index = newQuestions.findIndex((question) => question.id === id);
    setLoading(false);
    if (index === -1) {
      window.location.reload();
      return toast.error("Question not found");
    }
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    const res = await deleteQuestion(id, competitionId);
    toast.success("Question deleted successfully");
    setLoading(false);
    return res;
  };

  const handleAddQuestion = async (
    questionType: QuestionType,
    index: number | null,
  ) => {
    setShowOptionsIndex(null);

    try {
      setLoading(true);
      const question = await createQuestion({
        competitionId,
        type: questionType,
      });

      console.log("question", question);

      if (!question) return;

      setQuestions([...questions, question]);
      toast.success("Question added successfully");

      window.scrollTo({
        left: 0,
        top: (questionsRef.current?.getBoundingClientRect().bottom || 0) + 100,
        behavior: "smooth",
      });
    } catch (e) {
      console.error("Error adding question", e);
      toast.error("Error adding question");
    } finally {
      setLoading(false);
    }
  };

  const renderAddButton = (index: number | null) => (
    <div className="flex justify-center">
      <Button
        onClick={() =>
          setShowOptionsIndex(showOptionsIndex === index ? null : index)
        }
        className="flex items-center justify-center rounded-full px-4 py-2"
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
      {loading && <Spinner />}
      {questions.map((question, index) => (
        <div key={index + "editable" + question.id} className="">
          {getQuestionElement(question, question.type as QuestionType)}
          {loading && <Spinner />}
        </div>
      ))}
    </div>
  );
};

export default QuestionBuilder;
