"use server";

import { db } from "@/lib/dizzle/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { industryInsight, user } from "@/lib/dizzle/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Validate that the API key is set
if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables!");
    throw new Error("GEMINI_API_KEY is not configured. Please check your environment variables.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateAIInsights = async (industry: string, jobTitle?: string) => {
  const jobContext = jobTitle ? ` with specific focus on ${jobTitle} roles` : '';
  
  const prompt = `
You are a career insights analyst specializing in the Indian job market. Analyze the ${industry} industry${jobContext} in India and provide REALISTIC, ACCURATE market data.

CRITICAL SALARY GUIDELINES:
- Medical professionals (doctors, surgeons): ₹20,00,000 - ₹1,00,00,000+ per annum
- Senior specialists/consultants: ₹50,00,000 - ₹2,00,00,000+ per annum
- Technology professionals: ₹8,00,000 - ₹50,00,000+ per annum
- Management roles: ₹15,00,000 - ₹80,00,000+ per annum
- Entry-level professionals: ₹3,00,000 - ₹8,00,000 per annum

Provide insights in ONLY this JSON format (no additional text):
{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  ],
  "growthRate": number,
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": ["skill1", "skill2"]
}

STRICT REQUIREMENTS:
1. All salary values in Indian Rupees (INR) per annum - use REALISTIC numbers based on actual Indian market rates
2. For ${industry}${jobContext}, research and provide ACCURATE salary ranges (don't underestimate!)
3. Include 5-7 relevant roles with their actual market salaries in major Indian cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad)
4. Growth rate as percentage (realistic industry growth in India)
5. Include 5-7 skills and trends SPECIFIC to ${industry}${jobContext} - NOT generic tech skills unless this is a technology role
6. Top skills and recommended skills must be directly relevant to ${industry}${jobContext}
7. Consider experience levels: Junior (0-3 years), Mid (3-7 years), Senior (7-15 years), Expert (15+ years)

EXAMPLE for a surgeon:
- Junior Surgeon: ₹20,00,000 - ₹35,00,000
- Senior Surgeon: ₹50,00,000 - ₹1,00,00,000
- Consultant Surgeon: ₹80,00,000 - ₹2,00,00,000+

Return ONLY valid JSON. No markdown, no explanations.
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
};

export async function getIndustryInsights() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userProfile = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!userProfile) throw new Error("User not found");

  if (!userProfile.industryName) {
    return null;
  }

  const existingInsights = await db.query.industryInsight.findFirst({
    where: eq(industryInsight.industry, userProfile.industryName),
  });

  if (existingInsights) {
    return existingInsights;
  }

  // If no insights exist, generate them
  const insights = await generateAIInsights(
    userProfile.industryName,
    userProfile.jobTitle || undefined
  );

  const [newInsight] = await db
    .insert(industryInsight)
    .values({
      id: crypto.randomUUID(),
      industry: userProfile.industryName,
      ...insights,
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    .returning();

  return newInsight;
}

export async function refreshIndustryInsights() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userProfile = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!userProfile) throw new Error("User not found");

  if (!userProfile.industryName) {
    return null;
  }

  // Delete existing insights for this industry
  await db
    .delete(industryInsight)
    .where(eq(industryInsight.industry, userProfile.industryName));

  // Generate fresh insights
  const insights = await generateAIInsights(
    userProfile.industryName,
    userProfile.jobTitle || undefined
  );

  const [newInsight] = await db
    .insert(industryInsight)
    .values({
      id: crypto.randomUUID(),
      industry: userProfile.industryName,
      ...insights,
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    .returning();

  return newInsight;
}