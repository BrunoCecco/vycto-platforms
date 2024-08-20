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
      const response = await axios.get(
        `https://www.sofascore.com/api/v1/${selected.type}/${selected.id}`,
      );
      const data = response.data[selected.type];

      if (selected.type === "player") {
        setImageSrc(data.image);
        const playerQuestions = await createPlayerQuestions(data.id);
        setQuestions(playerQuestions);
      } else {
        console.log(data);
        const teamQuestions = await createTeamQuestions(data.id);
        setQuestions(teamQuestions);
      }
    };

    generateQuestions();
  }, [selected]);

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
            <div>
              <strong>Question:</strong> {q.question}
            </div>
            <div>
              <strong>Points:</strong> {q.points}
            </div>
            <div>
              <strong>Correct Answer:</strong> {q.correctAnswer}
            </div>
            <div>
              <strong>Answer 1:</strong> {q.answer1}
            </div>
            <div>
              <strong>Answer 2:</strong> {q.answer2}
            </div>
            <div>
              <strong>Answer 3:</strong> {q.answer3}
            </div>
            <div>
              <strong>Answer 4:</strong> {q.answer4}
            </div>
            {q.image1 && (
              <div>
                <strong>Image 1:</strong>
                <Image
                  src={q.image1!}
                  alt="Image 1"
                  width={100}
                  height={100}
                  objectFit="cover"
                />
              </div>
            )}
            {q.image2 && (
              <div>
                <strong>Image 2:</strong>
                <Image
                  src={q.image2}
                  alt="Image 1"
                  width={100}
                  height={100}
                  objectFit="cover"
                />
              </div>
            )}
            {q.image3 && (
              <div>
                <strong>Image 3:</strong>
                <Image
                  src={q.image3}
                  alt="Image 1"
                  width={100}
                  height={100}
                  objectFit="cover"
                />
              </div>
            )}
            {q.image4 && (
              <div>
                <strong>Image 4:</strong>
                <Image
                  src={q.image4}
                  alt="Image 1"
                  width={100}
                  height={100}
                  objectFit="cover"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionCreator;
