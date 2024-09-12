"use server";

import { getSession } from "@/lib/auth";
import {
  addDomainToVercel,
  removeDomainFromVercelProject,
  validDomainRegex,
} from "@/lib/domains";
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

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

export const createSite = async (formData: FormData) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const subdomain = formData.get("subdomain") as string;
  const admin = formData.get("admin") as string;

  try {
    const [response] = await db
      .insert(sites)
      .values({
        name,
        description,
        subdomain,
        userId: session.user.id,
        admin: admin || session.user.email,
      })
      .returning();

    revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This subdomain is already taken`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export const updateSite = withSiteAuth(
  async (formData: FormData, site: SelectSite, key: string) => {
    const value = formData.get(key) as string;

    try {
      let response;

      if (key === "customDomain") {
        if (value.includes("vercel.pub")) {
          return {
            error: "Cannot use vercel.pub subdomain as your custom domain",
          };

          // if the custom domain is valid, we need to add it to Vercel
        } else if (validDomainRegex.test(value)) {
          response = await db
            .update(sites)
            .set({
              customDomain: value,
            })
            .where(eq(sites.id, site.id))
            .returning()
            .then((res) => res[0]);

          await Promise.all([
            addDomainToVercel(value),
            // Optional: add www subdomain as well and redirect to apex domain
            // addDomainToVercel(`www.${value}`),
          ]);

          // empty value means the user wants to remove the custom domain
        } else if (value === "") {
          response = await db
            .update(sites)
            .set({
              customDomain: null,
            })
            .where(eq(sites.id, site.id))
            .returning()
            .then((res) => res[0]);
        }

        // if the site had a different customDomain before, we need to remove it from Vercel
        if (site.customDomain && site.customDomain !== value) {
          response = await removeDomainFromVercelProject(site.customDomain);

          /* Optional: remove domain from Vercel team
          // first, we need to check if the apex domain is being used by other sites
          const apexDomain = getApexDomain(`https://${site.customDomain}`);
          const domainCount = await db.select({ count: count() }).from(sites).where(or(eq(sites.customDomain, apexDomain), ilike(sites.customDomain, `%.${apexDomain}`))).then((res) => res[0].count);
          // if the apex domain is being used by other sites
          // we should only remove it from our Vercel project
          if (domainCount >= 1) {
            await removeDomainFromVercelProject(site.customDomain);
          } else {
            // this is the only site using this apex domain
            // so we can remove it entirely from our Vercel team
            await removeDomainFromVercelTeam(
              site.customDomain
            );
          }
          */
        }
      } else {
        response = await db
          .update(sites)
          .set({
            [key]: value,
          })
          .where(eq(sites.id, site.id))
          .returning()
          .then((res) => res[0]);
      }

      console.log(
        "Updated site data! Revalidating tags: ",
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        `${site.customDomain}-metadata`,
      );
      revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      site.customDomain && revalidateTag(`${site.customDomain}-metadata`);

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deleteSite = withSiteAuth(
  async (_: FormData, site: SelectSite) => {
    try {
      const [response] = await db
        .delete(sites)
        .where(eq(sites.id, site.id))
        .returning();

      revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      response.customDomain && revalidateTag(`${site.customDomain}-metadata`);
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

export const getSiteFromCompetitionId = async (competitionId: string) => {
  console.log("Getting site from competition ID: ", competitionId);
  const competition = await db.query.competitions.findFirst({
    where: eq(competitions.id, competitionId),
    columns: {
      siteId: true,
    },
  });

  return competition?.siteId;
};

export const createCompetition = withSiteAuth(
  async (_: FormData, site: SelectSite) => {
    const session = await getSession();
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
  const session = await getSession();
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

export const editUser = async (
  formData: FormData,
  _id: unknown,
  key: string,
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const value = formData.get(key) as string;
  console.log("Editing user: ", value);

  try {
    const [response] = await db
      .update(users)
      .set({
        [key]: value,
      })
      .where(eq(users.id, session.user.id))
      .returning();

    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This ${key} is already in use`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

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
        image: image ?? "",
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
  const session = await getSession();
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

// tbd competition stats
// export const updateCompetitionStats = async (
//   competitionId: string,
//   stats: any,
// ) => {
//   try {
//     const [response] = await db
//       .update(competitions)
//       .set({
//         stats,
//       })
//       .where(eq(competitions.id, competitionId))
//       .returning();

//     return response;
//   } catch (error: any) {
//     return {
//       error: error.message,
//     };
//   }
// }

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
        id: question?.id ?? nanoid(),
        competitionId: competitionId ?? question?.competitionId,
        type: type ?? question?.type,
        answer1:
          type === QuestionType.TrueFalse
            ? "True"
            : question?.answer1 ?? "answer1",
        answer2:
          type === QuestionType.TrueFalse
            ? "False"
            : question?.answer2 ?? "answer2",
        answer3:
          type === QuestionType.MatchOutcome
            ? "Draw"
            : question?.answer3 ?? "answer3",
        answer4: question?.answer4 ?? "answer4",
        correctAnswer: question?.correctAnswer ?? "",
        points: question?.points ?? 0,
        image1: question?.image1 ?? "",
        image2: question?.image2 ?? "",
        image3: question?.image3 ?? "",
        image4: question?.image4 ?? "",
        question: question?.question ?? "",
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
