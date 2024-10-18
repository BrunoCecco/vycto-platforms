"use server";

import { authOptions, withSuperAdminAuth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { revalidateTag } from "next/cache";
import db from "../db";
import { questions, userCompetitions, users, SelectQuestion } from "../schema";
import { QuestionType } from "../types";
import { getServerSession } from "next-auth";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

export const editUser = async (
  formData: FormData,
  _id: string,
  key: string,
) => {
  const session = await getServerSession(authOptions);
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

export const updateName = async (name: string, email: string) => {
  try {
    const [response] = await db
      .update(users)
      .set({
        name: name,
      })
      .where(eq(users.email, email))
      .returning();
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updateUsername = async (username: string, email: string) => {
  try {
    const [response] = await db
      .update(users)
      .set({
        username: username,
      })
      .where(eq(users.email, email))
      .returning();
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updateUser = withSuperAdminAuth(
  async (formData: FormData, userId: string, key: string) => {
    const value = formData.get(key) as string;
    console.log(value, userId);

    try {
      const [response] = await db
        .update(users)
        .set({
          [key]: value,
        })
        .where(eq(users.id, userId))
        .returning();

      revalidateTag("all-users");
      revalidateTag("all-admins");
      revalidateTag("all-super-admins");
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);
