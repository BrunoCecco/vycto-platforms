"use server";

import { getSession } from "@/lib/auth";
import { getBlurDataURL } from "@/lib/utils";
import { put } from "@vercel/blob";
import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { revalidateTag } from "next/cache";
import { withCompetitionAuth, withSiteAuth } from "./auth";
import db from "./db";
import {
  SelectCompetition,
  SelectSite,
  competitions,
  questions,
  sites,
  userCompetitions,
  users,
  answers,
  SelectQuestion,
} from "./schema";
import { QuestionType } from "./types";

export const calculateUserPoints = async (
  userId: string,
  competitionId: string,
) => {
  // join questions with answers on questionId and count for each userId how many answers are equal to correctAnswer
  const userPoints = await db.query.answers.findMany({
    where: and(
      eq(answers.userId, userId),
      eq(answers.competitionId, competitionId),
    ),
    with: {
      question: true,
    },
  });

  return userPoints.reduce((acc, answer) => {
    if (answer.question.correctAnswer === answer.answer) {
      const points = answer.question.points || 0;
      return acc + points;
    }
    return acc;
  }, 0);
};
