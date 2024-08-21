"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  createTeamQuestions,
  createPlayerQuestions,
  TeamEvent,
  Player,
} from "./questionService";
import Image from "next/image";
import { QuestionType } from "@/lib/types";
import { SelectQuestion } from "@/lib/schema";
import EditPlayerSelection from "../edit-questions/editPlayerSelection";
import EditWhatMinute from "../edit-questions/editWhatMinute";
import EditMatchOutcome from "../edit-questions/editMatchOutcome";
import EditGuessScore from "../edit-questions/editGuessScore";
import EditPlayerGoals from "../edit-questions/editPlayerGoals";
import EditTrueFalse from "../edit-questions/editTrueFalse";
import { createQuestion } from "@/lib/actions";

interface PlayerTeam {
  id: number;
  name: string;
  type: string;
  position?: string;
  team?: string;
}

const QuestionCreator: React.FC<{ selected: PlayerTeam }> = ({ selected }) => {
  const [questions, setQuestions] = useState<SelectQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuestions([]);
    setLoading(true);
    const generateQuestions = async () => {
      const response = await axios.get(
        `https://www.sofascore.com/api/v1/${selected.type}/${selected.id}`,
      );
      const data = response.data[selected.type];

      // get current site url for competitionId
      const url = window.location.href;
      const competitionId = url.split("/").pop();

      if (competitionId === undefined) {
        console.error("Competition ID not found");
        return;
      }

      if (selected.type === "player") {
        const playerQuestions = await createPlayerQuestions(
          data.id,
          competitionId,
        );
        try {
          const questionsWithImages = await Promise.all(
            playerQuestions.map((q) => replaceImageUrls(q)),
          );
          // create questions in the database
          await Promise.all(
            questionsWithImages.map(async (q: SelectQuestion) => {
              await createQuestion({
                competitionId: q.competitionId,
                type: q.type as QuestionType,
                question: q,
              });
            }),
          );
          setQuestions(questionsWithImages);
        } catch (e) {
          console.error(e);
          await Promise.all(
            playerQuestions.map(async (q: SelectQuestion) => {
              await createQuestion({
                competitionId: q.competitionId,
                type: q.type as QuestionType,
                question: q,
              });
            }),
          );
          setQuestions(playerQuestions);
        }
      } else {
        console.log(data);
        const teamQuestions = await createTeamQuestions(data.id, competitionId);
        try {
          const questionsWithImages = await Promise.all(
            teamQuestions.map((q) => replaceImageUrls(q)),
          );
          // create questions in the database
          await Promise.all(
            questionsWithImages.map(async (q: SelectQuestion) => {
              await createQuestion({
                competitionId: q.competitionId,
                type: q.type as QuestionType,
                question: q,
              });
            }),
          );
          setQuestions(questionsWithImages);
        } catch (e) {
          console.error(e);
          await Promise.all(
            teamQuestions.map(async (q: SelectQuestion) => {
              await createQuestion({
                competitionId: q.competitionId,
                type: q.type as QuestionType,
                question: q,
              });
            }),
          );
          setQuestions(teamQuestions);
        }
      }
      setLoading(false);
    };

    generateQuestions();
  }, [selected]);

  const getBlobImageUrl = async (url: string): Promise<string> => {
    const response = await fetch("/api/upload-image-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: url }),
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  };

  const replaceImageUrls = async (question: SelectQuestion) => {
    if (question.image1) {
      question.image1 = await getBlobImageUrl(question.image1);
    }
    if (question.image2) {
      question.image2 = await getBlobImageUrl(question.image2);
    }
    if (question.image3) {
      question.image3 = await getBlobImageUrl(question.image3);
    }
    if (question.image4) {
      question.image4 = await getBlobImageUrl(question.image4);
    }
    return question;
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

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
  return (
    <div className="">
      <h2 className="my-4 text-xl">Competition for {selected.name}</h2>
      <div className="flex flex-col gap-8">
        {loading && <div>Loading...</div>}
        {questions.map((q, idx) => (
          <div key={idx}>{getQuestionElement(q, q.type as QuestionType)}</div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCreator;
