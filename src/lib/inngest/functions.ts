import { db } from "@/lib/dizzle/client";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { industryInsight } from "@/lib/dizzle/schema";
import { eq } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
  { 
    id: "generate-industry-insights",
    name: "Generate Industry Insights",
  },
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight
  async ({ event, step }) => {
    const industries = await step.run("Fetch industries", async () => {
      // Drizzle ORM query to select all industries
      return await db.select({ industry: industryInsight.industry })
        .from(industryInsight);
    });

    for (const { industry } of industries) {
      const prompt = `Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
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

IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
Include at least 5 common roles for salary ranges.
Growth rate should be a percentage.
Include at least 5 skills and trends.`;

      const res = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await model.generateContent(p);
        },
        prompt
      );

      const candidate = res.response.candidates?.[0];
      if (!candidate?.content?.parts?.[0]) {
        throw new Error(`Failed to generate insights for ${industry}`);
      }

      const part = candidate.content.parts[0];
      const text = "text" in part ? part.text : "";
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

      const insights = JSON.parse(cleanedText);

      await step.run(`Update ${industry} insights`, async () => {
        // Drizzle ORM update query
        await db.update(industryInsight)
          .set({
            salaryRanges: insights.salaryRanges,
            growthRate: insights.growthRate,
            demandLevel: insights.demandLevel,
            topSkills: insights.topSkills,
            marketOutlook: insights.marketOutlook,
            keyTrends: insights.keyTrends,
            recommendedSkills: insights.recommendedSkills,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          })
          .where(eq(industryInsight.industry, industry));
      });
    }
  }
);