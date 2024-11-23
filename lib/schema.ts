import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  username: text("username"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  role: text("role").default("user"),
  country: text("country"),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});

export const superAdmins = pgTable("superAdmins", {
  userId: text("userId")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text("email").notNull().unique(),
});

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index().on(table.userId),
    };
  },
);

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => {
    return {
      compositePk: primaryKey({ columns: [table.identifier, table.token] }),
    };
  },
);

export const examples = pgTable("examples", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  domainCount: integer("domainCount"),
  url: text("url"),
  image: text("image"),
  imageBlurhash: text("imageBlurhash"),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    refreshTokenExpiresIn: integer("refresh_token_expires_in"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    oauth_token_secret: text("oauth_token_secret"),
    oauth_token: text("oauth_token"),
  },
  (table) => {
    return {
      userIdIdx: index().on(table.userId),
      compositePk: primaryKey({
        columns: [table.provider, table.providerAccountId],
      }),
    };
  },
);

export const sites = pgTable(
  "sites",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name"),
    description: text("description"),
    logo: text("logo"),
    loginBanner: text("loginBanner"),
    loginBannerDark: text("loginBannerDark"),
    story: text("story"),
    font: text("font").default("font-cal").notNull(),
    color1: text("color1").default("gray").notNull(),
    color2: text("color2").default("black").notNull(),
    color3: text("color3").default("white").notNull(),
    image: text("image"),
    imageBlurhash: text("imageBlurhash").default(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAhCAYAAACbffiEAAAACXBIWXMAABYlAAAWJQFJUiTwAAABfUlEQVR4nN3XyZLDIAwE0Pz/v3q3r55JDlSBplsIEI49h76k4opexCK/juP4eXjOT149f2Tf9ySPgcjCc7kdpBTgDPKByKK2bTPFEdMO0RDrusJ0wLRBGCIuelmWJAjkgPGDSIQEMBDCfA2CEPM80+Qwl0JkNxBimiaYGOTUlXYI60YoehzHJDEm7kxjV3whOQTD3AaCuhGKHoYhyb+CBMwjIAFz647kTqyapdV4enGINuDJMSScPmijSwjCaHeLcT77C7EC0C1ugaCTi2HYfAZANgj6Z9A8xY5eiYghDMNQBJNCWhASot0jGsSCUiHWZcSGQjaWWCDaGMOWnsCcn2QhVkRuxqqNxMSdUSElCDbp1hbNOsa6Ugxh7xXauF4DyM1m5BLtCylBXgaxvPXVwEoOBjeIFVODtW74oj1yBQah3E8tyz3SkpolKS9Geo9YMD1QJR1Go4oJkgO1pgbNZq0AOUPChyjvh7vlXaQa+X1UXwKxgHokB2XPxbX+AnijwIU4ahazAAAAAElFTkSuQmCC",
    ),
    subdomain: text("subdomain").unique(),
    customDomain: text("customDomain").unique(),
    message404: text("message404").default(
      "Blimey! You''ve found a page that doesn''t exist.",
    ),
    senderGroup: text("senderGroup"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .notNull()
      .$onUpdate(() => new Date()),
    userId: text("userId").references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    admin: text("admin").references(() => users.email, {
      onDelete: "no action",
      onUpdate: "no action",
    }),
  },
  (table) => {
    return {
      userIdIdx: index().on(table.userId),
    };
  },
);

export const siteRewards = pgTable(
  "siteRewards",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    siteId: text("siteId").references(() => sites.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    title: text("title"),
    description: text("description"),
    image: text("image"),
    imageBlurhash: text("imageBlurhash"),
    rewardWinners: integer("rewardWinners").default(1),
    startDate: text("startDate").notNull().default(new Date().toISOString()),
    endDate: text("endDate").notNull().default(new Date().toISOString()),
  },
  (table) => {
    return {
      siteIdIdx: index().on(table.siteId),
    };
  },
);

export const competitions = pgTable(
  "competitions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    eventId: text("eventId"), // sports api event id
    title: text("title"),
    description: text("description"),
    content: text("content"),
    sponsor: text("sponsor"),
    slug: text("slug")
      .notNull()
      .$defaultFn(() => createId()),
    image: text("image"),
    imageBlurhash: text("imageBlurhash").default(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAhCAYAAACbffiEAAAACXBIWXMAABYlAAAWJQFJUiTwAAABfUlEQVR4nN3XyZLDIAwE0Pz/v3q3r55JDlSBplsIEI49h76k4opexCK/juP4eXjOT149f2Tf9ySPgcjCc7kdpBTgDPKByKK2bTPFEdMO0RDrusJ0wLRBGCIuelmWJAjkgPGDSIQEMBDCfA2CEPM80+Qwl0JkNxBimiaYGOTUlXYI60YoehzHJDEm7kxjV3whOQTD3AaCuhGKHoYhyb+CBMwjIAFz647kTqyapdV4enGINuDJMSScPmijSwjCaHeLcT77C7EC0C1ugaCTi2HYfAZANgj6Z9A8xY5eiYghDMNQBJNCWhASot0jGsSCUiHWZcSGQjaWWCDaGMOWnsCcn2QhVkRuxqqNxMSdUSElCDbp1hbNOsa6Ugxh7xXauF4DyM1m5BLtCylBXgaxvPXVwEoOBjeIFVODtW74oj1yBQah3E8tyz3SkpolKS9Geo9YMD1QJR1Go4oJkgO1pgbNZq0AOUPChyjvh7vlXaQa+X1UXwKxgHokB2XPxbX+AnijwIU4ahazAAAAAElFTkSuQmCC",
    ),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .notNull()
      .$onUpdate(() => new Date()),
    date: text("date").notNull().default(new Date().toISOString()),
    published: boolean("published").default(false).notNull(),
    correctAnswersSubmitted: boolean("correctAnswersSubmitted")
      .default(false)
      .notNull(),
    rewardTitle: text("rewardTitle"),
    rewardDescription: text("rewardDescription"),
    rewardImage: text("rewardImage"),
    reward2Title: text("reward2Title"),
    reward2Description: text("reward2Description"),
    reward2Image: text("reward2Image"),
    reward3Title: text("reward3Title"),
    reward3Description: text("reward3Description"),
    reward3Image: text("reward3Image"),
    rewardWinners: integer("rewardWinners").default(1),
    reward2Winners: integer("reward2Winners").default(1),
    reward3Winners: integer("reward3Winners").default(1),
    color1: text("color1").default("gray").notNull(),
    color2: text("color2").default("black").notNull(),
    color3: text("color3").default("white").notNull(),
    siteId: text("siteId").references(() => sites.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    userId: text("userId").references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    admin: text("admin").references(() => users.email, {
      onDelete: "no action",
      onUpdate: "no action",
    }),
  },
  (table) => {
    return {
      siteIdIdx: index().on(table.siteId),
      userIdIdx: index().on(table.userId),
      slugSiteIdKey: uniqueIndex().on(table.slug, table.siteId),
    };
  },
);

export const userCompetitions = pgTable(
  "userCompetitions",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    username: text("username"),
    email: text("email"),
    image: text("image"),
    competitionId: text("competitionId")
      .notNull()
      .references(() => competitions.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    // decimal value
    points: decimal("points", { precision: 7, scale: 4 }).default("0.0000"),
    rewardId: integer("rewardId").default(-1),
    ranking: integer("ranking").default(-1),
    totalUsers: integer("totalUsers").default(0),
    averagePoints: decimal("averagePoints", { precision: 7, scale: 4 }).default(
      "0.0000",
    ),
    submitted: boolean("submitted").default(false),
    submissionDate: text("submissionDate")
      .notNull()
      .default(new Date().toISOString()),
  },
  (table) => {
    return {
      compositePk: primaryKey({
        columns: [table.userId, table.competitionId],
      }),
    };
  },
);

export const questions = pgTable(
  "questions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    competitionId: text("competitionId")
      .notNull()
      .references(() => competitions.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    question: text("question"),
    type: text("type"),
    answer1: text("answer1"),
    answer2: text("answer2"),
    answer3: text("answer3"),
    answer4: text("answer4"),
    correctAnswer: text("correctAnswer"),
    image1: text("image1"),
    image2: text("image2"),
    image3: text("image3"),
    image4: text("image4"),
    points: integer("points").default(1),
  },
  (table) => {
    return {
      competitionIdIdx: index().on(table.competitionId),
    };
  },
);

export const answers = pgTable(
  "answers",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    questionId: text("questionId")
      .notNull()
      .references(() => questions.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    competitionId: text("competitionId")
      .notNull()
      .references(() => competitions.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    answer: text("answer"),
    points: decimal("points", { precision: 7, scale: 4 }).default("0.0000"),
  },
  (table) => {
    return {
      compositePk: primaryKey({
        columns: [table.userId, table.questionId],
      }),
    };
  },
);

export const competitionsRelations = relations(
  competitions,
  ({ one, many }) => ({
    site: one(sites, { references: [sites.id], fields: [competitions.siteId] }),
    user: one(users, { references: [users.id], fields: [competitions.userId] }),
    siteadmin: one(users, {
      references: [users.email],
      fields: [competitions.admin],
    }),
    questions: many(questions),
    userCompetitions: many(userCompetitions),
  }),
);

export const questionsRelations = relations(questions, ({ one, many }) => ({
  competition: one(competitions, {
    references: [competitions.id],
    fields: [questions.competitionId],
  }),
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  user: one(users, { references: [users.id], fields: [answers.userId] }),
  question: one(questions, {
    references: [questions.id],
    fields: [answers.questionId],
  }),
  competition: one(competitions, {
    references: [competitions.id],
    fields: [answers.competitionId],
  }),
}));

export const userCompetitionsRelations = relations(
  userCompetitions,
  ({ one }) => ({
    user: one(users, {
      references: [users.id],
      fields: [userCompetitions.userId],
    }),
    competition: one(competitions, {
      references: [competitions.id],
      fields: [userCompetitions.competitionId],
    }),
  }),
);

export const sitesRelations = relations(sites, ({ one, many }) => ({
  competitions: many(competitions),
  user: one(users, { references: [users.id], fields: [sites.userId] }),
  siteadmin: one(users, { references: [users.email], fields: [sites.admin] }),
  siteRewards: many(siteRewards),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { references: [users.id], fields: [sessions.userId] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { references: [users.id], fields: [accounts.userId] }),
}));

export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  sites: many(sites),
  competitions: many(competitions),
}));

export const superAdminsRelations = relations(superAdmins, ({ one }) => ({
  user: one(users, { references: [users.id], fields: [superAdmins.userId] }),
}));

export type SelectSite = typeof sites.$inferSelect;
export type SelectCompetition = typeof competitions.$inferSelect;
export type SelectExample = typeof examples.$inferSelect;
export type SelectUser = typeof users.$inferSelect;
export type SelectSession = typeof sessions.$inferSelect;
export type SelectVerificationToken = typeof verificationTokens.$inferSelect;
export type SelectAccount = typeof accounts.$inferSelect;
export type SelectUserCompetition = typeof userCompetitions.$inferSelect;
export type SelectQuestion = typeof questions.$inferSelect;
export type SelectAnswer = typeof answers.$inferSelect;
export type SelectSiteReward = typeof siteRewards.$inferSelect;
