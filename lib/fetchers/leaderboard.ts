"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import db from "../db";
import { and, desc, eq, gte, inArray, lte, not, sql } from "drizzle-orm";
import {
  userCompetitions,
  competitions,
  users,
  SelectCompetition,
  SelectUserCompetition,
} from "../schema";
import { LeaderboardPeriod, QuestionType } from "../types";
import { updateUserPoints, updateAnswerPoints } from "../actions";
import {
  getAnswersForUser,
  getCompetitionFromId,
  getCompetitionUsers,
  getQuestionsForCompetition,
} from "./competitions";
import { getUserDataById } from "./users";
import {
  endOfSeason,
  startOfSeason,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "../utils";

export async function validateCorrectAnswers(competitionId: string) {
  const questions = await getQuestionsForCompetition(competitionId);
  // check each question has a valid correctAnswer field
  let questionsEmpty = questions.every(
    (question) =>
      question.correctAnswer === null || question.correctAnswer === "",
  );
  console.log(questions);
  if (questionsEmpty) {
    console.log(
      questions.find((q) => q.correctAnswer === null || q.correctAnswer === ""),
    );
    throw new Error("At least one question has no correct answer");
  }
  for (let question of questions) {
    if (question.correctAnswer === null || question.correctAnswer === "") {
      throw new Error("At least one question has no correct answer");
    }
    switch (question.type) {
      case QuestionType.TrueFalse:
        if (
          question.correctAnswer.toLowerCase() !== "true" &&
          question.correctAnswer.toLowerCase() !== "false"
        ) {
          throw new Error("TrueFalse question has invalid correct answer");
        }
        break;
      case QuestionType.WhatMinute:
        if (
          isNaN(parseInt(question.correctAnswer)) ||
          parseInt(question.correctAnswer) < 0 ||
          parseInt(question.correctAnswer) > 140
        ) {
          throw new Error(
            "WhatMinute question has invalid correct answer - must be a number between 0 and 140",
          );
        }
        break;
      case QuestionType.GeneralSelection:
      case QuestionType.PlayerSelection:
        if (
          question.correctAnswer != question.answer1 &&
          question.correctAnswer != question.answer2 &&
          question.correctAnswer != question.answer3 &&
          question.correctAnswer != question.answer4
        ) {
          throw new Error(
            question.type +
              " question has invalid correct answer - the correct answer must be one of the answer options",
          );
        }
        break;
      case QuestionType.MatchOutcome:
        if (
          question.correctAnswer != question.answer1 &&
          question.correctAnswer != "Draw" &&
          question.correctAnswer != question.answer2
        ) {
          throw new Error(
            "MatchOutcome question has invalid correct answer - the correct answer must be one of the answer options",
          );
        }
        break;
      case QuestionType.GuessScore:
        // match the correct answer to the format 'X-Y' or 'X - Y'
        if (!question.correctAnswer.match(/^\d+\s*-\s*\d+$/)) {
          throw new Error(
            "GuessScore question has invalid correct answer - the correct answer must be in the format 'X-Y'",
          );
        }
        break;
      case QuestionType.GeneralNumber:
        if (isNaN(parseInt(question.correctAnswer))) {
          throw new Error(
            "GeneralNumber question has invalid correct answer - the correct answer must be a number",
          );
        }
        break;
      default:
        throw new Error("Invalid question type " + question.type);
    }
  }
  return true;
}

export async function getCompetitionsForPeriod(
  siteId: string,
  startDate: Date,
  endDate: Date,
) {
  const startDateString = startDate
    .toISOString()
    .replace(/\.\d{3}Z$/, "+00:00[UTC]");
  const endDateString = endDate
    .toISOString()
    .replace(/\.\d{3}Z$/, "+00:00[UTC]");

  return await db.query.competitions.findMany({
    where: and(
      eq(competitions.siteId, siteId),
      gte(
        sql`replace(${competitions.date}, '[UTC]', '')`,
        sql`replace(${startDateString}, '[UTC]', '')`,
      ),
      lte(
        sql`replace(${competitions.date}, '[UTC]', '')`,
        sql`replace(${endDateString}, '[UTC]', '')`,
      ),
    ),
    orderBy: desc(competitions.createdAt),
  });
}

export async function getLeaderboardData(
  siteId: string,
  period: LeaderboardPeriod,
  compId?: string,
  startDate_?: Date,
  endDate_?: Date,
) {
  const startDate = startDate_
    ? startDate_
    : period === LeaderboardPeriod.Weekly
      ? startOfWeek
      : period === LeaderboardPeriod.Monthly
        ? startOfMonth
        : period === LeaderboardPeriod.Season
          ? startOfSeason
          : new Date(0);
  const endDate = endDate_
    ? endDate_
    : period === LeaderboardPeriod.Weekly
      ? endOfWeek
      : period === LeaderboardPeriod.Monthly
        ? endOfMonth
        : period === LeaderboardPeriod.Season
          ? endOfSeason
          : new Date();

  return await unstable_cache(
    async () => {
      const comps = await getCompetitionsForPeriod(siteId, startDate, endDate);
      const competitionIds = comps.map((comp) => comp.id);

      if (competitionIds.length === 0) {
        return [];
      }

      const data = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          emailVerified: users.emailVerified,
          image: users.image,
          username: users.username,
          role: users.role,
          birthDate: users.birthDate,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          points: sql`ROUND(SUM(CAST(${userCompetitions.points} AS TEXT)::float)::numeric, 2)`,
          rank: sql`ROW_NUMBER() OVER (ORDER BY SUM(CAST(${userCompetitions.points} AS TEXT)::float) DESC)`,
        })
        .from(userCompetitions)
        .leftJoin(users, eq(userCompetitions.userId, users.id))
        .where(inArray(userCompetitions.competitionId, competitionIds))
        .groupBy(users.id)
        .orderBy(desc(sql`SUM(${userCompetitions.points})`));

      return data;
    },
    [`${compId || period}-leaderboard`],
    {
      revalidate: 900,
      tags: [`${compId || period}-leaderboard`],
    },
  )();
}

export async function getCompetitionWinnerData(competitionId: string) {
  try {
    const competitionUsers = await db.query.userCompetitions.findMany({
      where: eq(userCompetitions.competitionId, competitionId),
    });
    const numWinnerData = await db.query.competitions.findFirst({
      where: eq(competitions.id, competitionId),
      columns: {
        rewardWinners: true,
        reward2Winners: true,
        reward3Winners: true,
      },
    });

    var unrichedSortedUsers = competitionUsers.sort((a, b) => {
      let aPoints = parseFloat(a.points || "0");
      let bPoints = parseFloat(b.points || "0");
      return bPoints - aPoints;
    });

    const sortedUsers = await Promise.all(
      unrichedSortedUsers.map(async (u: SelectUserCompetition) => {
        const user = await getUserDataById(u.userId);
        return {
          ...u,
          name: user?.name || u.name,
          username: user?.username || u.username,
          newsletter: user?.newsletter || false,
          prizeNotifications: user?.prizeNotifications || false,
          fanzoneNotifications: user?.fanzoneNotifications || false,
        };
      }),
    );

    if (
      !numWinnerData ||
      !numWinnerData.rewardWinners ||
      !numWinnerData.reward2Winners ||
      !numWinnerData.reward3Winners
    ) {
      throw new Error("Competition not found");
    }

    return {
      rewardWinners: sortedUsers.slice(0, numWinnerData.rewardWinners),
      reward2Winners: sortedUsers.slice(
        numWinnerData.rewardWinners,
        numWinnerData.rewardWinners + numWinnerData.reward2Winners,
      ),
      reward3Winners: sortedUsers.slice(
        numWinnerData.rewardWinners + numWinnerData.reward2Winners,
        numWinnerData.rewardWinners +
          numWinnerData.reward2Winners +
          numWinnerData.reward3Winners,
      ),
    };
  } catch (error) {
    console.log(error);
  }
}
