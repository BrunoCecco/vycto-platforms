"use server";

import { unstable_cache } from "next/cache";
import db from "../db";
import { and, desc, eq, gte, lte, not } from "drizzle-orm";
import { userCompetitions, competitions, users } from "../schema";
import { LeaderboardPeriod, QuestionType } from "../types";
import { updateUserPoints, updateAnswerPoints } from "../actions";
import { getAnswersForUser, getQuestionsForCompetition } from "./competitions";

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

export async function calculateUserPoints(
  userId: string,
  competitionId: string,
) {
  const questions = await getQuestionsForCompetition(competitionId);
  const answers = await getAnswersForUser(userId, competitionId);
  var points: number = 0;

  // caclulate the points for each question depending on the question type
  for (let question of questions) {
    const questionPoints = question.points || 0;
    const userAnswer = answers.find(
      (a) => a.questionId === question.id,
    )?.answer;
    if (userAnswer === undefined) continue;

    let pointsToAdd = 0;
    if (
      question.correctAnswer === null ||
      question.correctAnswer === "" ||
      userAnswer === null ||
      userAnswer === ""
    ) {
      continue;
    }
    switch (question.type) {
      case QuestionType.TrueFalse:
        if (question.correctAnswer == userAnswer) {
          pointsToAdd = questionPoints;
        }
        break;
      case QuestionType.WhatMinute:
        const percentageDifference = Math.abs(
          parseInt(question.correctAnswer) - parseInt(userAnswer),
        );
        pointsToAdd = questionPoints * (1 - percentageDifference / 90);
        break;
      case QuestionType.GeneralSelection:
      case QuestionType.PlayerSelection:
        if (question.correctAnswer == userAnswer) {
          pointsToAdd = questionPoints;
        }
        break;
      case QuestionType.MatchOutcome:
        if (question.correctAnswer == userAnswer) {
          pointsToAdd = questionPoints;
        }
        break;
      case QuestionType.GuessScore:
        const correctHome = parseInt(question.correctAnswer.split("-")[0]) || 0;
        const correctAway = parseInt(question.correctAnswer.split("-")[1]) || 0;
        const userHome = parseInt(userAnswer.split("-")[0]) || 0;
        const userAway = parseInt(userAnswer.split("-")[1]) || 0;
        const homeDifference = Math.abs(correctHome - userHome);
        pointsToAdd +=
          (questionPoints / 2) *
          (1 - homeDifference / Math.max(homeDifference, 10));
        const awayDifference = Math.abs(correctAway - userAway);
        pointsToAdd +=
          (questionPoints / 2) *
          (1 - awayDifference / Math.max(awayDifference, 10));
        break;
      case QuestionType.GeneralNumber:
        const correctNumber = parseInt(question.correctAnswer) || 0;
        const userNumber = parseInt(userAnswer) || 0;
        const numberDifference = Math.abs(correctNumber - userNumber);
        // set a sensible numerator depending on the correct number
        const numerator = Math.max(correctNumber, 5);
        pointsToAdd =
          questionPoints *
          (1 - numberDifference / Math.max(numerator, numberDifference));
        break;
      default:
        break;
    }
    points += pointsToAdd;
    await updateAnswerPoints(userId, question.id, pointsToAdd);
    console.log(
      `User ${userId} has ${points} points for question ${question.type} (${question.question})`,
    );
  }
  // update the user's points in the database
  await updateUserPoints(userId, competitionId, points);
  return points;
}

export async function calculateCompetitionPoints(competitionId: string) {
  console.log(`Calculating points for competition ${competitionId}`);
  const competitionUsers = await db.query.userCompetitions.findMany({
    where: eq(userCompetitions.competitionId, competitionId),
  });

  var usersWithPoints = [];
  var points;
  for (let user of competitionUsers) {
    points = await calculateUserPoints(user.userId, competitionId);
    console.log(`User ${user.userId} has ${points} points`);
    usersWithPoints.push({
      userId: user.userId,
      points: points,
    });
  }
  var sortedUsers = usersWithPoints.sort((a, b) => b.points - a.points);
  return usersWithPoints;
}

export async function getCompetitionsForPeriod(
  siteId: string,
  startDate: Date,
  endDate: Date,
) {
  return await unstable_cache(
    async () => {
      return await db.query.competitions.findMany({
        where: and(
          eq(competitions.siteId, siteId),
          gte(competitions.createdAt, startDate),
          lte(competitions.createdAt, endDate),
        ),
        orderBy: desc(competitions.createdAt),
      });
    },
    [`${siteId}-${startDate}-${endDate}`],
    {
      revalidate: 900,
      tags: [`${siteId}-${startDate}-${endDate}`],
    },
  )();
}

export async function getLeaderboardData(
  siteId: string,
  period: LeaderboardPeriod,
) {
  const startDate =
    period === "last week"
      ? new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - 7,
        )
      : period === "monthly"
        ? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        : period === "season"
          ? new Date(new Date().getFullYear(), 0, 1)
          : new Date(0);
  const endDate =
    period === "last week"
      ? new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
        )
      : period === "monthly"
        ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        : period === "season"
          ? new Date(new Date().getFullYear(), 11, 31)
          : new Date();

  // get all competitions for the site within the specified period
  const comps = await getCompetitionsForPeriod(siteId, startDate, endDate);

  // await promise for all site competitions and store in array
  const allCompetitionPoints = await Promise.all(
    comps.map((comp: any) => calculateCompetitionPoints(comp.id)),
  );

  const allUsers = allCompetitionPoints.flat();
  // deduplicate users and sum their points
  const userPoints = allUsers.reduce((acc: any, user: any) => {
    if (acc[user.userId]) {
      acc[user.userId] += user.points;
    } else {
      acc[user.userId] = user.points;
    }
    return acc;
  }, {});

  const leaderboardData = await Promise.all(
    Object.keys(userPoints).map(async (userId) => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });
      return {
        ...user,
        points: userPoints[userId],
      };
    }),
  );

  return leaderboardData.sort((a, b) => b.points - a.points);
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

    var sortedUsers = competitionUsers.sort((a, b) => {
      let aPoints = parseFloat(a.points || "0");
      let bPoints = parseFloat(b.points || "0");
      return bPoints - aPoints;
    });

    return {
      sortedUsers: sortedUsers,
      rewardWinners: numWinnerData?.rewardWinners || 0,
      reward2Winners: numWinnerData?.reward2Winners || 0,
      reward3Winners: numWinnerData?.reward3Winners || 0,
    };
  } catch (error) {
    console.log(error);
  }
}
