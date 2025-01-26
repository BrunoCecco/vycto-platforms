"use server";

import { authOptions } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { revalidateTag } from "next/cache";
import { withCompetitionAuth, withSiteAuth } from "../auth";
import db from "../db";
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
  SelectUser,
  SelectUserCompetition,
} from "../schema";
import { LeaderboardPeriod, QuestionType } from "../types";
import { getServerSession } from "next-auth";
import {
  getAnswersForUser,
  getCompetitionFromId,
  getQuestionsForCompetition,
  getSiteDataById,
  getUserDataById,
} from "../fetchers";
import {
  startOfSeason,
  endOfSeason,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "../utils";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

export const createCompetition = withSiteAuth(
  async (_: FormData, site: SelectSite) => {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }

    const [response] = await db
      .insert(competitions)
      .values({
        siteId: site.id,
        userId: session.user.id,
        sponsor: site.name,
        date: new Date().toISOString(),
      })
      .returning();

    revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-competitions`,
    );
    site.customDomain && revalidateTag(`${site.customDomain}-competitions`);

    return response;
  },
);

// creating a separate function for this because we're not using FormData
export const updateCompetition = async (data: SelectCompetition) => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const competition = await db.query.competitions.findFirst({
    where: eq(competitions.id, data.id),
    with: {
      site: true,
    },
  });

  if (!competition || competition.userId !== session.user.id) {
    return {
      error: "Competition not found",
    };
  }

  try {
    const [response] = await db
      .update(competitions)
      .set({
        title: data.title,
        description: data.description,
        content: data.content,
      })
      .where(eq(competitions.id, data.id))
      .returning();

    revalidateTag(
      `${competition.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-competitions`,
    );
    revalidateTag(
      `${competition.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${competition.slug}`,
    );

    // if the site has a custom domain, we need to revalidate those tags too
    competition.site?.customDomain &&
      (revalidateTag(`${competition.site?.customDomain}-competitions`),
      revalidateTag(`${competition.site?.customDomain}-${competition.slug}`));

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updateCompetitionMetadata = withCompetitionAuth(
  async (
    formData: FormData,
    competition: SelectCompetition & {
      site: SelectSite;
    },
    key: string,
  ) => {
    const value = formData.get(key) as string;

    try {
      let response;

      response = await db
        .update(competitions)
        .set({
          [key]:
            key === "published" || key == "correctAnswersSubmitted"
              ? value === "true"
              : value,
        })
        .where(eq(competitions.id, competition.id))
        .returning()
        .then((res) => res[0]);

      revalidateTag(
        `${competition.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-competitions`,
      );
      revalidateTag(
        `${competition.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${competition.slug}`,
      );

      // if the site has a custom domain, we need to revalidate those tags too
      competition.site?.customDomain &&
        (revalidateTag(`${competition.site?.customDomain}-competitions`),
        revalidateTag(`${competition.site?.customDomain}-${competition.slug}`));

      revalidateTag(`${competition.id}-users`);
      revalidateTag(`${competition.id}-competition-with-site`);

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This slug is already in use`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deleteCompetition = withCompetitionAuth(
  async (_: FormData, competition: SelectCompetition) => {
    try {
      const site = await getSiteDataById(competition.siteId!);

      const [response] = await db
        .delete(competitions)
        .where(eq(competitions.id, competition.id))
        .returning({
          siteId: competitions.siteId,
        });

      revalidateTag(
        `${site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-competitions`,
      );

      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

export const enterUserToCompetition = async (
  userId: string,
  username: string,
  name: string,
  email: string,
  competitionId: string,
  siteId: string,
  image?: string,
) => {
  try {
    // first check if the user is already in the competition
    const existingUser = await db.query.userCompetitions.findFirst({
      where: and(
        eq(userCompetitions.userId, userId),
        eq(userCompetitions.competitionId, competitionId),
      ),
    });

    if (existingUser) {
      return existingUser;
    }

    const [response] = await db
      .insert(userCompetitions)
      .values({
        userId,
        username,
        name,
        email,
        competitionId,
        image: image || "",
      })
      .returning();

    revalidateTag(`${userId}-${competitionId}-comp`);
    revalidateTag(`${userId}-${siteId}-comps`);
    revalidateTag(`${competitionId}-users`);
    revalidateTag(`${userId}-${competitionId}-answers`);
    revalidateTag(`${competitionId}-leaderboard`);
    revalidateTag(`${LeaderboardPeriod.Weekly}-leaderboard`);
    revalidateTag(`${LeaderboardPeriod.Monthly}-leaderboard`);
    revalidateTag(`${LeaderboardPeriod.Season}-leaderboard`);

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const submitAnswers = async (
  userId: string,
  competitionId: string,
  siteId: string,
  localAnswers: { [key: string]: string },
) => {
  //const session = await getServerSession(authOptions);
  //if (!session?.user.id) {
  //return {
  //error: "Not authenticated",
  //};
  //}

  try {
    // First, submit any local answers that haven't been saved to the database yet
    for (const [questionId, answer] of Object.entries(localAnswers)) {
      await db
        .insert(answers)
        .values({
          userId,
          competitionId,
          siteId,
          questionId,
          answer,
        })
        .onConflictDoUpdate({
          target: [answers.userId, answers.questionId],
          set: { answer },
        });
    }

    // Then, mark the user's competition as submitted
    const [response] = await db
      .update(userCompetitions)
      .set({
        submitted: true,
        submissionDate: new Date().toISOString(),
      })
      .where(
        and(
          eq(userCompetitions.userId, userId),
          eq(userCompetitions.competitionId, competitionId),
        ),
      )
      .returning();

    revalidateTag(`${userId}-${competitionId}-answers`);

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updateUserPoints = async (
  userId: string,
  competitionId: string,
  points: number,
) => {
  try {
    const [response] = await db
      .update(userCompetitions)
      .set({
        points: points.toString(),
      })
      .where(
        and(
          eq(userCompetitions.userId, userId),
          eq(userCompetitions.competitionId, competitionId),
        ),
      )
      .returning();

    revalidateTag(`${userId}-${competitionId}-answers`);

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updateAnswerPoints = async (
  userId: string,
  questionId: string,
  competitionId: string,
  points: number,
  correctAnswer: string,
) => {
  try {
    const [response] = await db
      .update(answers)
      .set({
        points: points.toString(),
        correctAnswer,
      })
      .where(
        and(eq(answers.userId, userId), eq(answers.questionId, questionId)),
      )
      .returning();

    revalidateTag(`${userId}-${competitionId}-answers`);

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const createQuestion = async ({
  siteId,
  competitionId,
  type,
  question,
}: {
  siteId: string;
  competitionId: string;
  type: QuestionType;
  question?: SelectQuestion;
}) => {
  try {
    const response = await db
      .insert(questions)
      .values({
        id: question?.id || nanoid(),
        siteId: siteId || question?.siteId!,
        competitionId: competitionId || question?.competitionId!,
        type: type || question?.type,
        answer1:
          type === QuestionType.TrueFalse
            ? "True"
            : question?.answer1 || "answer1",
        answer2:
          type === QuestionType.TrueFalse
            ? "False"
            : question?.answer2 || "answer2",
        answer3:
          type === QuestionType.MatchOutcome
            ? "Draw"
            : question?.answer3 || "answer3",
        answer4: question?.answer4 || "answer4",
        correctAnswer: question?.correctAnswer || "",
        points: question?.points || 0,
        image1: question?.image1 || "",
        image2: question?.image2 || "",
        image3: question?.image3 || "",
        image4: question?.image4 || "",
        question: question?.question || "",
      })
      .returning()
      .then((res) => res[0]);

    revalidateTag(`${competitionId}-questions`);

    console.log("Created question: ", response);
    return response;
  } catch (error: any) {
    console.log("Error creating question: ", error.message);
  }
};

export const updateQuestionMetadata = async (
  formData: FormData,
  question: SelectQuestion,
  key: string,
) => {
  const value = formData.get(key) as string;

  try {
    const response = await db
      .update(questions)
      .set({
        [key]: value,
      })
      .where(eq(questions.id, question.id))
      .returning()
      .then((res) => res[0]);

    revalidateTag(`${question.competitionId}-questions`);

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const deleteQuestion = async (
  questionId: string,
  competitionId: string,
) => {
  try {
    const response = await db
      .delete(questions)
      .where(eq(questions.id, questionId))
      .returning()
      .then((res) => res[0]);

    revalidateTag(`${competitionId}-questions`);

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const answerQuestion = async (formData: FormData) => {
  try {
    const userId = formData.get("userId") as string;
    const questionId = formData.get("questionId") as string;
    const competitionId = formData.get("competitionId") as string;
    const siteId = formData.get("siteId") as string;
    const answer = formData.get("answer") as string;

    // first check if the user has already answered this question
    const existingAnswer = await db.query.answers.findFirst({
      where: and(
        eq(answers.userId, userId),
        eq(answers.questionId, questionId),
      ),
    });

    if (existingAnswer) {
      const response = await db
        .update(answers)
        .set({
          answer,
        })
        .where(
          and(eq(answers.userId, userId), eq(answers.questionId, questionId)),
        )
        .returning()
        .then((res) => res[0]);

      return response;
    }

    const response = await db
      .insert(answers)
      .values({
        userId,
        questionId,
        competitionId,
        siteId,
        answer,
      })
      .returning();

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updateStatsForUser = async (
  userId: string,
  competitionId: string,
  rewardId: number,
  ranking: number,
  totalUsers: number,
  averagePoints: number,
) => {
  try {
    const response = await db
      .update(userCompetitions)
      .set({
        rewardId,
        ranking,
        totalUsers,
        averagePoints: averagePoints.toString(),
      })
      .where(
        and(
          eq(userCompetitions.userId, userId),
          eq(userCompetitions.competitionId, competitionId),
        ),
      )
      .returning()
      .then((res) => res[0]);

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

interface IUserWithPoints {
  userId: string;
  points: string;
  competitionId: string;
}

// goes through each user in a competition and assigns their reward id or -1 if they didn't win
export const updateUserCompetitionStats = async (
  usersWithPoints: IUserWithPoints[],
  compData: SelectCompetition,
) => {
  try {
    var sortedUsers = usersWithPoints.sort((a, b) => {
      let aPoints = parseFloat(a.points || "0");
      let bPoints = parseFloat(b.points || "0");
      return bPoints - aPoints;
    });

    let reward1Winners = compData?.rewardWinners || 0;
    let reward2Winners = compData?.reward2Winners
      ? reward1Winners + compData.reward2Winners
      : reward1Winners;
    let reward3Winners = compData?.reward3Winners
      ? reward2Winners + compData.reward3Winners
      : reward2Winners;

    let totalUsers = usersWithPoints.length;
    let averagePoints = sortedUsers.reduce(
      (acc, user) => acc + parseFloat(user.points || "0"),
      0,
    );
    averagePoints /= totalUsers;

    // change to promise.all
    const updateStatsPromises = sortedUsers.map(async (user, i) => {
      let rewardId =
        i < reward1Winners
          ? 0
          : i < reward2Winners
            ? 1
            : i < reward3Winners
              ? 2
              : -1;
      let ranking = i + 1;

      return await updateStatsForUser(
        user.userId,
        user.competitionId,
        rewardId,
        ranking,
        totalUsers,
        averagePoints,
      );
    });

    await Promise.all(updateStatsPromises);

    revalidateTag(`${compData.id}-users`);

    return usersWithPoints;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updateUserCompetitionMetadata = async (
  userId: string,
  competitionId: string,
  formData: FormData,
  key: string,
) => {
  const value = formData.get(key) as string;

  try {
    let response;

    response = await db
      .update(userCompetitions)
      .set({
        [key]: value,
      })
      .where(
        and(
          eq(userCompetitions.userId, userId),
          eq(userCompetitions.competitionId, competitionId),
        ),
      )
      .returning();

    revalidateTag(`${userId}-${competitionId}-comp`);
    revalidateTag(`${competitionId}-users`);
    revalidateTag(`${userId}-${competitionId}-answers`);

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

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
        if (correctHome == userHome && correctAway == userAway) {
          pointsToAdd += questionPoints;
        }
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
    await updateAnswerPoints(
      userId,
      question.id,
      competitionId,
      pointsToAdd,
      question.correctAnswer,
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

  var usersWithPoints: IUserWithPoints[] = [];
  var points;

  const calculateUserPointsPromise = competitionUsers.map(async (user) => {
    const points = await calculateUserPoints(user.userId, competitionId);
    console.log(`User ${user.email} has ${points} points`);
    return {
      userId: user.userId,
      points: points.toString(),
      competitionId: user.competitionId,
    };
  });

  var usersWithPoints: IUserWithPoints[] = await Promise.all(
    calculateUserPointsPromise,
  );

  const comp = await getCompetitionFromId(competitionId);

  if (!comp) {
    return {
      error: "Competition not found",
    };
  }
  // now update the user competition stats
  const res = await updateUserCompetitionStats(usersWithPoints, comp);

  revalidateTag(`${competitionId}-users`);
  revalidateTag(`${competitionId}-leaderboard`);
  revalidateTag(`${LeaderboardPeriod.Weekly}-leaderboard`);
  revalidateTag(`${LeaderboardPeriod.Monthly}-leaderboard`);
  revalidateTag(`${LeaderboardPeriod.Season}-leaderboard`);

  return usersWithPoints;
}

export async function duplicateCompetition(competitionId: string) {
  const competition = await db.query.competitions.findFirst({
    where: eq(competitions.id, competitionId),
    with: {
      site: true,
    },
  });

  if (!competition) {
    return {
      error: "Competition not found",
    };
  }

  const qs = await getQuestionsForCompetition(competitionId);

  const newCompetition = await db
    .insert(competitions)
    .values({
      siteId: competition.siteId,
      userId: competition.userId,
      title: competition.title + " (Copy)",
      description: competition.description,
      content: competition.content,
      sponsor: competition.sponsor,
      image: competition.image,
      imageBlurhash: competition.imageBlurhash,
      image1: competition.image1,
      image2: competition.image2,
      image3: competition.image3,
      image4: competition.image4,
      date: competition.date,
      published: false,
      correctAnswersSubmitted: false,
      rewardTitle: competition.rewardTitle,
      rewardDescription: competition.rewardDescription,
      rewardImage: competition.rewardImage,
      reward2Title: competition.reward2Title,
      reward2Description: competition.reward2Description,
      reward2Image: competition.reward2Image,
      reward3Title: competition.reward3Title,
      reward3Description: competition.reward3Description,
      reward3Image: competition.reward3Image,
      rewardWinners: competition.rewardWinners,
      reward2Winners: competition.reward2Winners,
      reward3Winners: competition.reward3Winners,
      rules: competition.rules,
      consent: competition.consent,
    })
    .returning()
    .then((res) => res[0]);

  for (const q of qs) {
    await new Promise((resolve) => setTimeout(resolve, 10));
    await db
      .insert(questions)
      .values({
        id: nanoid(),
        siteId: q.siteId,
        competitionId: newCompetition.id,
        type: q.type,
        answer1: q.answer1,
        answer2: q.answer2,
        answer3: q.answer3,
        answer4: q.answer4,
        correctAnswer: q.correctAnswer,
        points: q.points,
        image1: q.image1,
        image2: q.image2,
        image3: q.image3,
        image4: q.image4,
        question: q.question,
      })
      .returning()
      .then((res) => res[0]);
  }

  revalidateTag(
    `${competition.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-competitions`,
  );
  revalidateTag(`${competition.site?.subdomain}.localhost:3000-competitions`);
  revalidateTag(`${competition.site?.subdomain}-competitions`);
  revalidateTag("all-competitions");

  return newCompetition;
}
