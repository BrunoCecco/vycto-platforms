"use server";

import { getSession } from "@/lib/auth";
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
import { getAnswersForUser, getQuestionsForCompetition } from "./fetchers";
import { updateUserPoints } from "./actions";
