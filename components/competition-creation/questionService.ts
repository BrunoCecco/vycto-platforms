// services/questionService.ts
import axios from "axios";
import questionTemplates from "./templateQuestions.json";
import { createId } from "@paralleldrive/cuid2";
import { SelectQuestion } from "@/lib/schema";
import { updateCompetitionMetadata } from "@/lib/actions";
import { capitalize } from "@/lib/utils";

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

export const createFootballQuestions = async ({
  type,
  playerId,
  teamId,
  name,
  competitionId,
}: {
  type: string;
  playerId: number | null;
  teamId: number;
  name: string;
  competitionId: string;
}): Promise<SelectQuestion[]> => {
  // Fetch team events
  const eventsResponse = await axios.get(
    `https://api.sofascore.com/api/v1/team/${teamId}/near-events`,
  );
  const { nextEvent } = eventsResponse.data;

  // Fetch players for the team
  const playersResponse = await axios.get(
    `https://api.sofascore.com/api/v1/team/${teamId}/players`,
  );
  const players: Player[] = playersResponse.data.players.map(
    (player: any) => player.player,
  );

  // update competition date with nextEvent.startTimestamp
  const formData = new FormData();
  // iso string from timestamp
  const isoStringDate = new Date(nextEvent.startTimestamp * 1000)
    .toISOString()
    .split("T")[0];
  formData.append("date", isoStringDate);
  await updateCompetitionMetadata(formData, competitionId, "date");
  const formData1 = new FormData();
  formData1.append("title", `Competition for ${capitalize(nextEvent.slug)}`);
  await updateCompetitionMetadata(formData1, competitionId, "title");

  const questions: SelectQuestion[] = [];

  questionTemplates.football.forEach((template) => {
    questions.push({
      id: createId(),
      competitionId: competitionId,
      question: template.question
        .replace("<insert_team1>", nextEvent.homeTeam.name)
        .replace("<insert_team2>", nextEvent.awayTeam.name)
        .replace("<insert_player1>", name),
      type: template.type,
      answer1: template.answers[0]
        ?.replace("<insert_team1>", nextEvent.homeTeam.name)
        .replace("<insert_player1>", name),
      answer2: template.answers[1]
        ?.replace("<insert_team2>", nextEvent.awayTeam.name)
        .replace("<insert_player2>", players[0].name),
      answer3: template.answers[2]?.replace(
        "<insert_player3>",
        players[1].name,
      ),
      answer4: template.answers[3]?.replace(
        "<insert_player4>",
        players[2].name,
      ),
      correctAnswer: null,
      image1:
        template.type == "PlayerSelection"
          ? `https://api.sofascore.com/api/v1/player/${playerId}/image`
          : `https://api.sofascore.com/api/v1/team/${nextEvent.homeTeam?.id}/image`,
      image2:
        template.type == "PlayerSelection"
          ? `https://api.sofascore.com/api/v1/player/${players[0].id}/image`
          : `https://api.sofascore.com/api/v1/team/${nextEvent.awayTeam?.id}/image`,
      image3:
        template.type == "PlayerSelection"
          ? `https://api.sofascore.com/api/v1/player/${players[1].id}/image`
          : `https://api.sofascore.com/api/v1/team/${teamId}/image`,
      image4:
        template.type == "PlayerSelection"
          ? `https://api.sofascore.com/api/v1/player/${players[2].id}/image`
          : `https://api.sofascore.com/api/v1/team/${teamId}/image`,
      points: 5,
    });
  });
  return questions;
};

const generateEventQuestions = (
  event: TeamEvent,
  players: Player[],
  competitionId: string,
): SelectQuestion[] => {
  const questions: SelectQuestion[] = [];

  questionTemplates.football.forEach((template) => {
    questions.push({
      id: createId(),
      competitionId: competitionId,
      question: template.question
        .replace("<insert_team1>", event.homeTeam.name)
        .replace("<insert_team2>", event.awayTeam.name)
        .replace("<insert_player1>", event.awayTeam.name),
      type: template.type,
      answer1: template.answers[0].replace(
        "<insert_team1>",
        event.homeTeam.name,
      ),
      answer2: template.answers[1].replace(
        "<insert_team2>",
        event.awayTeam.name,
      ),
      answer3: template.answers[2],
      answer4: template.answers[3],
      correctAnswer: null,
      image1: `https://api.sofascore.com/api/v1/team/${event.homeTeam.id}/image`,
      image2: `https://api.sofascore.com/api/v1/team/${event.awayTeam.id}/image`,
      image3: `https://api.sofascore.com/api/v1/team/${event.awayTeam.id}/image`,
      image4: `https://api.sofascore.com/api/v1/team/${event.awayTeam.id}/image`,
      points: 5,
    });
  });
  return questions;
};

export const createQuestions = async ({
  entityId,
  competitionId,
  type,
}: {
  entityId: number;
  competitionId: string;
  type: string;
}): Promise<SelectQuestion[]> => {
  // Fetch entity information (including their team ID)
  const response = await axios.get(
    `https://api.sofascore.com/api/v1/${type}/${entityId}`,
  );
  const entity = response.data[type];
  const name = entity.name;
  let playerId = null;
  if (type === "player") {
    playerId = entity.id;
  }
  const teamId = entity.team?.id || entity.id;
  const sport = entity.team?.sport.name || entity.sport.name;
  console.log("sport", sport, "type", type, "entity", entity, "teamId", teamId);

  // Generate questions for the entity and sport
  let questions: SelectQuestion[] = [];
  //   switch (sport) {
  //     case "football":
  questions = await createFootballQuestions({
    type,
    playerId,
    teamId,
    name,
    competitionId,
  });
  //   break;
  //     default:
  //       questions = [];
  //   }

  return questions;
};
