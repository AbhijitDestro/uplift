import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, integer, json, real } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  jobTitle: text("job_title"),
  companyName: text("company_name"),
  yearsOfExperience: integer("years_of_experience"),
  industryName: text("industry_name"),
  keySkills: text("key_skills").array(),
  bio: text("bio"),
  assessmentScore: integer("assessment_score"),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  assessments: many(assessment),
  resume: one(resume),
  coverLetters: many(coverLetter),
  industryInsight: one(industryInsight, {
    fields: [user.industryName],
    references: [industryInsight.industry],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// Assessment table
export const assessment = pgTable(
  "assessment",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    quizScore: real("quiz_score").notNull(), // Overall quiz score
    questions: json("questions").$type<Array<{
      question: string;
      answer: string;
      userAnswer: string;
      isCorrect: boolean;
    }>>().notNull(), // Array of question objects
    category: text("category").notNull(), // "Technical", "Behavioral", etc.
    improvementTip: text("improvement_tip"), // AI-generated improvement tip
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("assessment_userId_idx").on(table.userId)],
);

// Resume table
export const resume = pgTable("resume", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique() // One resume per user
    .references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(), // Markdown content
  atsScore: real("ats_score"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// CoverLetter table
export const coverLetter = pgTable(
  "cover_letter",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(), // Markdown content
    jobDescription: text("job_description"),
    companyName: text("company_name").notNull(), // Name of the company applying to
    jobTitle: text("job_title").notNull(), // Position applying for
    status: text("status").notNull().default("draft"), // draft, completed
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("coverLetter_userId_idx").on(table.userId)],
);

// IndustryInsight table
export const industryInsight = pgTable(
  "industry_insight",
  {
    id: text("id").primaryKey(),
    industry: text("industry").notNull().unique(), // The industry this data belongs to (e.g., "tech-software-development")
    
    // Salary data
    salaryRanges: json("salary_ranges").$type<Array<{
      role: string;
      min: number;
      max: number;
      median: number;
      location?: string;
    }>>().notNull(), // Array of salary range objects
    
    // Industry trends
    growthRate: real("growth_rate").notNull(), // Industry growth rate
    demandLevel: text("demand_level").notNull(), // "High", "Medium", "Low"
    topSkills: text("top_skills").array().notNull(), // Most in-demand skills
    
    // Market conditions
    marketOutlook: text("market_outlook").notNull(), // "Positive", "Neutral", "Negative"
    keyTrends: text("key_trends").array().notNull(), // Array of current industry trends
    
    // Learning suggestions
    recommendedSkills: text("recommended_skills").array().notNull(), // Skills recommended for the industry
    
    lastUpdated: timestamp("last_updated").defaultNow().notNull(),
    nextUpdate: timestamp("next_update").notNull(), // Scheduled update time
  },
  (table) => [index("industryInsight_industry_idx").on(table.industry)],
);

// Relations
export const assessmentRelations = relations(assessment, ({ one }) => ({
  user: one(user, {
    fields: [assessment.userId],
    references: [user.id],
  }),
}));

export const resumeRelations = relations(resume, ({ one }) => ({
  user: one(user, {
    fields: [resume.userId],
    references: [user.id],
  }),
}));

export const coverLetterRelations = relations(coverLetter, ({ one }) => ({
  user: one(user, {
    fields: [coverLetter.userId],
    references: [user.id],
  }),
}));

export const industryInsightRelations = relations(industryInsight, ({ many }) => ({
  users: many(user),
}));

