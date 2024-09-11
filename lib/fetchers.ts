"use server";

import { unstable_cache } from "next/cache";
import db from "./db";
import { and, desc, eq, not } from "drizzle-orm";
import {
  questions,
  answers,
  userCompetitions,
  competitions,
  sites,
  users,
  SelectCompetition,
} from "./schema";
import { serialize } from "next-mdx-remote/serialize";
import { replaceExamples, replaceTweets } from "@/lib/remark-plugins";
import { QuestionType } from "./types";
import { updateUserPoints, updateAnswerPoints } from "./actions";

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      return await db.query.sites.findFirst({
        where: subdomain
          ? eq(sites.subdomain, subdomain)
          : eq(sites.customDomain, domain),
        with: {
          user: true,
        },
      });
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
  )();
}

export async function getAllCompetitions() {
  return await unstable_cache(
    async () => {
      return await db.query.competitions.findMany({
        where: eq(competitions.published, true),
        orderBy: [desc(competitions.createdAt)],
        with: {
          site: true,
        },
      });
    },
    ["all-competitions"],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: ["all-competitions"],
    },
  )();
}

export async function getCompetitionsForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      // select all competitions (all fields) for the site
      return await db
        .select({
          competition: competitions,
        })
        .from(competitions)
        .leftJoin(sites, eq(competitions.siteId, sites.id))
        .where(
          and(
            eq(competitions.published, true),
            subdomain
              ? eq(sites.subdomain, subdomain)
              : eq(sites.customDomain, domain),
          ),
        )
        .orderBy(desc(competitions.createdAt));
    },
    [`${domain}-competitions`],
    {
      revalidate: 900,
      tags: [`${domain}-competitions`],
    },
  )();
}

export async function getCompetitionData(domain: string, slug: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      const data = await db
        .select({
          competition: competitions,
          site: sites,
          user: users,
        })
        .from(competitions)
        .leftJoin(sites, eq(sites.id, competitions.siteId))
        .leftJoin(users, eq(users.id, sites.userId))
        .where(
          and(
            eq(competitions.slug, slug),
            eq(competitions.published, true),
            subdomain
              ? eq(sites.subdomain, subdomain)
              : eq(sites.customDomain, domain),
          ),
        )
        .then((res) =>
          res.length > 0
            ? {
                ...res[0].competition,
                site: res[0].site
                  ? {
                      ...res[0].site,
                      user: res[0].user,
                    }
                  : null,
              }
            : null,
        );

      if (!data) return null;

      const [mdxSource, adjacentCompetitions] = await Promise.all([
        getMdxSource(data.content!),
        db
          .select({
            slug: competitions.slug,
            title: competitions.title,
            createdAt: competitions.createdAt,
            description: competitions.description,
            image: competitions.image,
            imageBlurhash: competitions.imageBlurhash,
          })
          .from(competitions)
          .leftJoin(sites, eq(sites.id, competitions.siteId))
          .where(
            and(
              eq(competitions.published, true),
              not(eq(competitions.id, data.id)),
              subdomain
                ? eq(sites.subdomain, subdomain)
                : eq(sites.customDomain, domain),
            ),
          ),
      ]);

      return {
        ...data,
        mdxSource,
        adjacentCompetitions,
      };
    },
    [`${domain}-${slug}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${domain}-${slug}`],
    },
  )();
}

async function getMdxSource(competitionContents: string) {
  // transforms links like <link> to [link](link) as MDX doesn't support <link> syntax
  // https://mdxjs.com/docs/what-is-mdx/#markdown
  const content =
    competitionContents?.replaceAll(/<(https?:\/\/\S+)>/g, "[$1]($1)") ?? "";
  // Serialize the content string into MDX
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [replaceTweets, () => replaceExamples(db)],
    },
  });

  return mdxSource;
}

export async function getQuestionsForCompetition(competitionId: string) {
  return await unstable_cache(
    async () => {
      return await db.query.questions.findMany({
        where: eq(questions.competitionId, competitionId),
        orderBy: desc(questions.id),
      });
    },
    [`${competitionId}-questions`],
    {
      revalidate: 900,
      tags: [`${competitionId}-questions`],
    },
  )();
}

export async function getAnswersForUser(userId: string, competitionId: string) {
  return await unstable_cache(
    async () => {
      return await db.query.answers.findMany({
        where: and(
          eq(answers.userId, userId),
          eq(answers.competitionId, competitionId),
        ),
      });
    },
    [`${userId}-${competitionId}-answers`],
    {
      revalidate: 900,
      tags: [`${userId}-${competitionId}-answers`],
    },
  )();
}

export async function getCompetitionUsers(competitionId: string) {
  return await unstable_cache(
    async () => {
      return await db.query.userCompetitions.findMany({
        where: eq(userCompetitions.competitionId, competitionId),
      });
    },
    [`${competitionId}-users`],
    {
      revalidate: 900,
      tags: [`${competitionId}-users`],
    },
  )();
}

export async function getUserData(email: string) {
  return await unstable_cache(
    async () => {
      return await db.query.users.findFirst({
        where: eq(users.email, email),
      });
    },
    [`${email}-user`],
    {
      revalidate: 900,
      tags: [`${email}-user`],
    },
  )();
}

export async function validateCorrectAnswers(competitionId: string) {
  const questions = await getQuestionsForCompetition(competitionId);
  // check each question has a valid correctAnswer field
  let questionsEmpty = questions.every(
    (question) =>
      question.correctAnswer === null || question.correctAnswer === "",
  );
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
