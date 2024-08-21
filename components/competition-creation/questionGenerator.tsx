"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  createTeamQuestions,
  createPlayerQuestions,
  Question,
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

interface PlayerTeam {
  id: number;
  name: string;
  type: string;
  position?: string;
  team?: string;
}

const QuestionCreator: React.FC<{ selected: PlayerTeam }> = ({ selected }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [imageSrc, setImageSrc] = useState<string | undefined>();

  useEffect(() => {
    const generateQuestions = async () => {
      const res = await axios.get(
        `https://www.sofascore.com/api/v1/player/1/image`,
        { responseType: "arraybuffer" },
      );
      const buffer = Buffer.from(res.data, "binary");

      console.log(buffer);

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
        setImageSrc(data.image);
        const playerQuestions = await createPlayerQuestions(
          data.id,
          competitionId,
        );
        setQuestions(playerQuestions);
      } else {
        console.log(data);
        const teamQuestions = await createTeamQuestions(data.id, competitionId);
        setQuestions(teamQuestions);
      }
    };

    generateQuestions();
  }, [selected]);

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const getQuestionElement = (question: Question, type: QuestionType) => {
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
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={selected.name}
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            marginBottom: "20px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      )}
      <h2 style={{ textAlign: "center" }}>Competition for {selected.name}</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {questions.map((q, idx) => (
          <li
            key={idx}
            style={{
              background: "#f9f9f9",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "10px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            {getQuestionElement(q, q.type as QuestionType)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionCreator;
