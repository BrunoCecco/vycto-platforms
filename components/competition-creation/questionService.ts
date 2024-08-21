// services/questionService.ts
import axios from "axios";
import questionTemplates from "./questionTemplates.json";
import { createId } from "@paralleldrive/cuid2";

export interface Player {
  id: number;
  name: string;
  image: string;
}

export interface TeamEvent {
  homeTeam: {
    name: string;
    id: number;
    teamColors: {
      primary: string;
      secondary: string;
    };
  };
  awayTeam: {
    name: string;
    id: number;
  };
}

export interface Question {
  question: string;
  type: string;
  answer1: string | null;
  answer2: string | null;
  answer3: string | null;
  answer4: string | null;
  correctAnswer: string | null;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  points: number;
  id: string;
  competitionId: string;
}

export const createTeamQuestions = async (
  teamId: number,
  competitionId: string,
): Promise<Question[]> => {
  // Fetch team events
  const eventsResponse = await axios.get(
    `https://www.sofascore.com/api/v1/team/${teamId}/near-events`,
  );
  const { nextEvent } = eventsResponse.data;

  // Fetch players for the team
  const playersResponse = await axios.get(
    `https://www.sofascore.com/api/v1/team/${teamId}/players`,
  );
  const players: Player[] = playersResponse.data.players.map(
    (player: any) => player.player,
  );

  const eventQuestions: Question[] = generateEventQuestions(
    nextEvent,
    players,
    competitionId,
  );

  return eventQuestions;
};

const generateEventQuestions = (
  event: TeamEvent,
  players: Player[],
  competitionId: string,
): Question[] => {
  const questions: Question[] = [];

  // 1. Match Outcome Question
  const matchOutcomeTemplate = questionTemplates.MatchOutcome;
  questions.push({
    id: createId(),
    competitionId: competitionId,
    question: matchOutcomeTemplate.question
      .replace("<insert_team1>", event.homeTeam.name)
      .replace("<insert_team2>", event.awayTeam.name),
    type: "MatchOutcome",
    answer1: matchOutcomeTemplate.answers[0].replace(
      "<insert_team1>",
      event.homeTeam.name,
    ),
    answer2: matchOutcomeTemplate.answers[1].replace(
      "<insert_team2>",
      event.awayTeam.name,
    ),
    answer3: matchOutcomeTemplate.answers[2],
    answer4: null,
    correctAnswer: null,
    image1: `https://www.sofascore.com/api/v1/team/${event.homeTeam.id}/image`,
    image2: `https://www.sofascore.com/api/v1/team/${event.awayTeam.id}/image`,
    image3: null,
    image4: null,
    points: 5,
  });

  // 2. Guess the Score
  const guessScoreTemplate = questionTemplates.GuessScore;
  questions.push({
    id: createId(),
    competitionId: competitionId,
    question: guessScoreTemplate.question
      .replace("<insert_team1>", event.homeTeam.name)
      .replace("<insert_team2>", event.awayTeam.name),
    type: "GuessScore",
    answer1: guessScoreTemplate.answers[0].replace(
      "<insert_team1>",
      event.homeTeam.name,
    ),
    answer2: guessScoreTemplate.answers[1].replace(
      "<insert_team2>",
      event.awayTeam.name,
    ),
    answer3: guessScoreTemplate.answers[2],
    answer4: guessScoreTemplate.answers[3],
    correctAnswer: null,
    image1: `https://www.sofascore.com/api/v1/team/${event.homeTeam.id}/image`,
    image2: `https://www.sofascore.com/api/v1/team/${event.awayTeam.id}/image`,
    image3: null,
    image4: null,
    points: 5,
  });

  // 3. Player Goals (selecting random players)
  const playerGoalsTemplate = questionTemplates.PlayerGoals;
  const selectedPlayers = players.slice(0, 4);
  questions.push({
    id: createId(),
    competitionId: competitionId,
    question: playerGoalsTemplate.question.replace(
      "<insert_team>",
      event.homeTeam.name,
    ),
    type: "PlayerGoals",
    answer1: selectedPlayers[0]?.name || null,
    answer2: selectedPlayers[1]?.name || null,
    answer3: selectedPlayers[2]?.name || null,
    answer4: selectedPlayers[3]?.name || null,
    correctAnswer: null,
    image1: selectedPlayers[0]
      ? `https://www.sofascore.com/api/v1/player/${selectedPlayers[0].id}/image`
      : null,
    image2: selectedPlayers[1]
      ? `https://www.sofascore.com/api/v1/player/${selectedPlayers[1].id}/image`
      : null,
    image3: selectedPlayers[2]
      ? `https://www.sofascore.com/api/v1/player/${selectedPlayers[2].id}/image`
      : null,
    image4: selectedPlayers[3]
      ? `https://www.sofascore.com/api/v1/player/${selectedPlayers[3].id}/image`
      : null,
    points: 5,
  });

  // 4. True/False Question
  const trueFalseTemplate = questionTemplates.TrueFalse;
  questions.push({
    id: createId(),
    competitionId: competitionId,
    question: trueFalseTemplate.question
      .replace("<insert_team>", event.homeTeam.name)
      .replace("<insert_opponent>", event.awayTeam.name),
    type: "TrueFalse",
    answer1: trueFalseTemplate.answers[0],
    answer2: trueFalseTemplate.answers[1],
    answer3: null,
    answer4: null,
    correctAnswer: null,
    image1: `https://www.sofascore.com/api/v1/team/${event.homeTeam.id}/image`,
    image2: `https://www.sofascore.com/api/v1/team/${event.awayTeam.id}/image`,
    image3: null,
    image4: null,
    points: 5,
  });

  // 5. What Minute Question
  const whatMinuteTemplate = questionTemplates.WhatMinute;
  questions.push({
    id: createId(),
    competitionId: competitionId,
    question: whatMinuteTemplate.question
      .replace("<insert_team1>", event.homeTeam.name)
      .replace("<insert_team2>", event.awayTeam.name),
    type: "WhatMinute",
    answer1: whatMinuteTemplate.answers[0],
    answer2: whatMinuteTemplate.answers[1],
    answer3: whatMinuteTemplate.answers[2],
    answer4: whatMinuteTemplate.answers[3],
    correctAnswer: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    points: 5,
  });

  // 6. Player Selection Question (selecting random players)
  const playerSelectionTemplate = questionTemplates.PlayerSelection;
  questions.push({
    id: createId(),
    competitionId: competitionId,
    question: playerSelectionTemplate.question
      .replace("<insert_team1>", event.homeTeam.name)
      .replace("<insert_team2>", event.awayTeam.name),
    type: "PlayerSelection",
    answer1: selectedPlayers[0]?.name || null,
    answer2: selectedPlayers[1]?.name || null,
    answer3: selectedPlayers[2]?.name || null,
    answer4: selectedPlayers[3]?.name || null,
    correctAnswer: null,
    image1: selectedPlayers[0]
      ? `https://www.sofascore.com/api/v1/player/${selectedPlayers[0].id}/image`
      : null,
    image2: selectedPlayers[1]
      ? `https://www.sofascore.com/api/v1/player/${selectedPlayers[1].id}/image`
      : null,
    image3: selectedPlayers[2]
      ? `https://www.sofascore.com/api/v1/player/${selectedPlayers[2].id}/image`
      : null,
    image4: selectedPlayers[3]
      ? `https://www.sofascore.com/api/v1/player/${selectedPlayers[3].id}/image`
      : null,
    points: 5,
  });

  return questions;
};

export const createPlayerQuestions = async (
  playerId: number,
  competitionId: string,
): Promise<Question[]> => {
  // Fetch player information (including their team ID)
  const playerResponse = await axios.get(
    `https://www.sofascore.com/api/v1/player/${playerId}`,
  );
  const player = playerResponse.data.player;
  const teamId = player.team.id;

  // Generate questions for the player's team
  let teamQuestions = await createTeamQuestions(teamId, competitionId);

  // Filter or adjust questions to focus more on the specific player
  teamQuestions = teamQuestions.map((q) => {
    if (q.type === "PlayerGoals" || q.type === "PlayerSelection") {
      return {
        ...q,
        question: q.question.replace("<insert_player>", player.name),
        answer1: player.name,
        image1: `https://www.sofascore.com/api/v1/player/${playerId}/image`,
      };
    }
    return q;
  });

  return teamQuestions;
};
