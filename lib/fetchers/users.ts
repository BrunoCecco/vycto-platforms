"use server";

import { unstable_cache } from "next/cache";
import db from "../db";
import { and, desc, eq, gte, like, lte, not, or } from "drizzle-orm";
import { adminSites, answers, questions, users } from "../schema";
import { ADMIN, SUPER_ADMIN } from "../constants";
import { QuestionType } from "../types";

export async function getUserData(email: string) {
  return await unstable_cache(
    async () => {
      return await db.query.users.findFirst({
        where: eq(users.email, email),
      });
    },
    [`${email}-user`],
    {
      revalidate: 9000,
      tags: [`${email}-user`],
    },
  )();
}

export async function getUserDataById(userId: string) {
  return await unstable_cache(
    async () => {
      return await db.query.users.findFirst({
        where: eq(users.id, userId),
      });
    },
    [`${userId}-user`],
    {
      revalidate: 9000,
      tags: [`${userId}-user`],
    },
  )();
}

export async function getAllUsers(offset: number, limit: number) {
  return await unstable_cache(
    async () => {
      return await db
        .select({
          id: users.id,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          username: users.username,
        })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset);
    },
    [`all-users-${offset}-${limit}`],
    {
      revalidate: 900, // Cache for 1 minute
      tags: [`all-users-${offset}-${limit}`],
    },
  )();
}

export async function getAllAdmins() {
  return await unstable_cache(
    async () => {
      return await db
        .select({
          id: users.id,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          username: users.username,
        })
        .from(users)
        .where(eq(users.role, ADMIN))
        .orderBy(desc(users.createdAt));
    },
    ["all-admins"],
    {
      revalidate: 60, // Cache for 1 minute
      tags: ["all-admins"],
    },
  )();
}

export async function getAdminSites(email: string) {
  // return await unstable_cache(
  //   async () => {
  return await db.query.adminSites.findMany({
    where: eq(adminSites.email, email),
  });
  //   },
  //   [`admin-sites-${email}`],
  //   {
  //     revalidate: 60, // Cache for 1 minute
  //     tags: [`admin-sites-${email}`],
  //   },
  // )();
}

export async function getSiteAdmins(siteId: string) {
  return await unstable_cache(
    async () => {
      return await db.query.adminSites.findMany({
        where: eq(adminSites.siteId, siteId),
      });
    },
    [`site-admins-${siteId}`],
    {
      revalidate: 60, // Cache for 1 minute
      tags: [`site-admins-${siteId}`],
    },
  )();
}

export async function getAllSiteAdmins() {
  return await unstable_cache(
    async () => {
      return await db
        .select({
          id: users.id,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          username: users.username,
        })
        .from(users)
        .leftJoin(adminSites, eq(adminSites.email, users.email));
    },
    ["all-site-admins"],
    {
      revalidate: 60, // Cache for 1 minute
      tags: ["all-site-admins"],
    },
  )();
}

export async function getTopPredictions(userId: string, siteId: string) {
  return await unstable_cache(
    async () => {
      return await db
        .select({
          question: questions,
          answer: answers,
        })
        .from(questions)
        .leftJoin(
          answers,
          and(eq(answers.userId, userId), eq(answers.questionId, questions.id)),
        )
        .where(
          and(
            eq(questions.siteId, siteId),
            eq(questions.correctAnswer, answers.answer),
            eq(questions.type, QuestionType.GuessScore),
            not(like(questions.question, "% Half %")),
            not(like(questions.question, "% half %")),
          ),
        );
    },
    [`${userId}-${siteId}1-top-predictions`],
    {
      revalidate: 900,
      tags: [`${userId}-${siteId}1-top-predictions`],
    },
  )();
}
