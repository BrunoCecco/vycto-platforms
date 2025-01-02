"use server";

import { unstable_cache } from "next/cache";
import db from "../db";
import { and, desc, eq, gte, lte, not } from "drizzle-orm";
import { users } from "../schema";
import { ADMIN, SUPER_ADMIN } from "../constants";

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

export async function getAllUsers(role: string, offset: number, limit: number) {
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
        .where(eq(users.role, role))
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset);
    },
    [`all-users-${role}-${offset}-${limit}`],
    {
      revalidate: 900, // Cache for 1 minute
      tags: [`all-users-${role}-${offset}-${limit}`],
    },
  )();
}

export async function getAllSuperAdmins() {
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
        .where(eq(users.role, SUPER_ADMIN))
        .orderBy(desc(users.createdAt));
    },
    ["all-super-admins"],
    {
      revalidate: 60, // Cache for 1 minute
      tags: ["all-super-admins"],
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
