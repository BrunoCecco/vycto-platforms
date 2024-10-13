"use server";

import { unstable_cache } from "next/cache";
import db from "../db";
import { and, desc, eq, gte, lte, not } from "drizzle-orm";
import {
  questions,
  answers,
  userCompetitions,
  competitions,
  sites,
  users,
  SelectCompetition,
} from "../schema";

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

      const [adjacentCompetitions] = await Promise.all([
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

export async function getQuestionsForCompetition(competitionId: string) {
  // return await unstable_cache(
  //   async () => {
  return await db.query.questions.findMany({
    where: eq(questions.competitionId, competitionId),
    orderBy: desc(questions.id),
  });
  //   },
  //   [`${competitionId}-questions`],
  //   {
  //     revalidate: 900,
  //     tags: [`${competitionId}-questions`],
  //   },
  // )();
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
  // return await unstable_cache(
  //   async () => {
  return await db.query.userCompetitions.findMany({
    where: eq(userCompetitions.competitionId, competitionId),
  });
  //   },
  //   [`${competitionId}-users`],
  //   {
  //     revalidate: 900,
  //     tags: [`${competitionId}-users`],
  //   },
  // )();
}

export async function getUserCompetitions(userId: string) {
  // return await unstable_cache(
  //   async () => {
  return await db.query.userCompetitions.findMany({
    where: eq(userCompetitions.userId, userId),
  });

  //   },
  //   [`${competitionId}-users`],
  //   {
  //     revalidate: 900,
  //     tags: [`${competitionId}-users`],
  //   },
  // )();
}

export async function getCompetitionFromId(competitionId: string) {
  return await unstable_cache(
    async () => {
      return await db.query.competitions.findFirst({
        where: eq(competitions.id, competitionId),
      });
    },
    [`${competitionId}-competition`],
    {
      revalidate: 900,
      tags: [`${competitionId}-competition`],
    },
  )();
}
