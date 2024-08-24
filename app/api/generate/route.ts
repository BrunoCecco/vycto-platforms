import { OpenAI } from "openai";
import { createId } from "@paralleldrive/cuid2";
import { SelectQuestion } from "@/lib/schema";
import { updateCompetitionMetadata } from "@/lib/actions";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { prompt } from "@/components/competition-creation/prompt";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY ||
    "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",
});

const QuestionType = z.enum([
  "MatchOutcome",
  "GuessScore",
  "GeneralSelection",
  "TrueFalse",
  "WhatMinute",
  "PlayerSelection",
  "GeneralNumber",
]);

const Questions = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      type: QuestionType,
      answer1: z.string(),
      answer2: z.string(),
      answer3: z.string(),
      answer4: z.string(),
      points: z.number(),
    }),
  ),
});

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  let { entity, competitionId } = await req.json();
  console.log(entity, competitionId);
  // Fetch team events
  //   const eventsResponse = await axios.get(
  //     `https://api.sofascore.com/api/v1/team/${teamId}/near-events`,
  //   );
  //   const { nextEvent } = eventsResponse.data;

  //   // Fetch players for the team
  //   const playersResponse = await axios.get(
  //     `https://api.sofascore.com/api/v1/team/${teamId}/players`,
  //   );
  //   const players: Player[] = playersResponse.data.players.map(
  //     (player: any) => player.player,
  //   );

  //   // update competition date with nextEvent.startTimestamp
  //   const formData = new FormData();
  //   // iso string from timestamp
  //   const isoStringDate = new Date(nextEvent.startTimestamp * 1000)
  //     .toISOString()
  //     .split("T")[0];
  //   formData.append("date", isoStringDate);
  //   await updateCompetitionMetadata(formData, competitionId, "date");

  const resolvedPrompt = prompt(entity);
  var eventQuestions = await generateQuestions(resolvedPrompt!);

  console.log(eventQuestions);
  // add competitionId to each question
  eventQuestions.forEach((q: any) => {
    q.id = createId();
    q.competitionId = competitionId;
  });

  return NextResponse.json(eventQuestions);
}

const generateQuestions = async (resolvedPrompt: string): Promise<any> => {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: resolvedPrompt,
      },
      { role: "user", content: "..." },
    ],
    response_format: zodResponseFormat(Questions, "questions"),
  });

  const questions = completion.choices[0].message.parsed?.questions;

  return questions;
};

// export const prompt = (entity: string) => {
//   return `
// You are an expert in sports trivia. Generate 5 trivia questions for the next upcoming sporting event for ${entity}.
// The questions should cover a variety of types such as match outcome, player goals, what minute, player selection, guess the score, and true/false statements.
// Player selection questions can include selecting from up to 4 random players from the event (e.g. "Which of the following players will score a goal in the match?").
// Incorporate relevant athletes from the upcoming event where necessary in certain questions.
// The questions should be returned in a JSON format according to the following schema:

// [
//   {
//     "question": "string", // the trivia question
//     "type": "string", // the type of question, e.g., 'MatchOutcome', 'GeneralSelection', 'GeneralNumber', 'TrueFalse', 'GuessScore', 'PlayerSelection', 'WhatMinute'
//     "answer1": "string", // the first possible answer (optional)
//     "answer2": "string", // the second possible answer (optional)
//     "answer3": "string", // the third possible answer (optional)
//     "answer4": "string",  // the fourth possible answer (optional)
//     "points": "number" // points awarded for correct answer (1-10)
//   }
// ]

// If the question requires a generic numerical answer (such as what minute will a goal be scored), leave the answer fields empty as the correct answer will be determined at a later time.

// `;
// };
