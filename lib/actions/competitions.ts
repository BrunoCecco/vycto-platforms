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
import { QuestionType } from "../types";
import { getServerSession } from "next-auth";

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
        admin: session.user.email,
        date: new Date().toISOString(),
        color1: site.color1,
        color2: site.color2,
        color3: site.color3,
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
      const [response] = await db
        .delete(competitions)
        .where(eq(competitions.id, competition.id))
        .returning({
          siteId: competitions.siteId,
        });

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
  email: string,
  competitionId: string,
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
        email,
        competitionId,
        image: image || "",
      })
      .returning();

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
  localAnswers: { [key: string]: string },
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  try {
    // First, submit any local answers that haven't been saved to the database yet
    for (const [questionId, answer] of Object.entries(localAnswers)) {
      await db
        .insert(answers)
        .values({
          userId: session.user.id,
          competitionId,
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
      })
      .where(
        and(
          eq(userCompetitions.userId, session.user.id),
          eq(userCompetitions.competitionId, competitionId),
        ),
      )
      .returning();

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
    console.log("Updating user points: ", userId, competitionId, points);
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
  points: number,
) => {
  console.log("Updating answer points: ", userId, questionId, points);
  try {
    const [response] = await db
      .update(answers)
      .set({
        points: points.toString(),
      })
      .where(
        and(eq(answers.userId, userId), eq(answers.questionId, questionId)),
      )
      .returning();

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const createQuestion = async ({
  competitionId,
  type,
  question,
}: {
  competitionId: string;
  type: QuestionType;
  question?: SelectQuestion;
}) => {
  try {
    const response = await db
      .insert(questions)
      .values({
        id: question?.id || nanoid(),
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

    console.log("Created question: ", response);
    return response;
  } catch (error: any) {
    console.log("Error creating question: ", error.message);
  }
};

export const updateQuestionMetadata = async (
  formData: FormData,
  question: any,
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

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const deleteQuestion = async (questionId: string) => {
  try {
    const response = await db
      .delete(questions)
      .where(eq(questions.id, questionId))
      .returning()
      .then((res) => res[0]);

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

// goes through each user in a competition and assigns their reward id or -1 if they didn't win
export const updateUserCompetitionStats = async (competitionId: string) => {
  try {
    const competitionUsers = await db.query.userCompetitions.findMany({
      where: eq(userCompetitions.competitionId, competitionId),
    });
    const rewardWinnerData = await db.query.competitions.findFirst({
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

    let reward1Winners = rewardWinnerData?.rewardWinners || 0;
    let reward2Winners = rewardWinnerData?.reward2Winners
      ? reward1Winners + rewardWinnerData.reward2Winners
      : reward1Winners;
    let reward3Winners = rewardWinnerData?.reward3Winners
      ? reward2Winners + rewardWinnerData.reward3Winners
      : reward2Winners;

    let totalUsers = competitionUsers.length;
    let averagePoints = sortedUsers.reduce(
      (acc, user) => acc + parseFloat(user.points || "0"),
      0,
    );
    averagePoints /= totalUsers;

    for (let i = 0; i < sortedUsers.length; i++) {
      let user = sortedUsers[i];
      let rewardId =
        i < reward1Winners
          ? 0
          : i < reward2Winners
            ? 1
            : i < reward3Winners
              ? 2
              : -1;
      let ranking = i + 1;

      await updateStatsForUser(
        user.userId,
        user.competitionId,
        rewardId,
        ranking,
        totalUsers,
        averagePoints,
      );
    }

    const updatedCompetitionUsers = await db.query.userCompetitions.findMany({
      where: eq(userCompetitions.competitionId, competitionId),
    });

    return updatedCompetitionUsers;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
