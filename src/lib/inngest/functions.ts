import { db } from "@/lib/dizzle/client";
import { inngest } from "./client";
// import { GoogleGenerativeAI } from "@google/generative-ai";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Validate that the API key is set
if (!OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY is not set in environment variables!");
    throw new Error("OPENROUTER_API_KEY is not configured. Please check your environment variables.");
}
import { industryInsight } from "@/lib/dizzle/schema";
import { eq } from "drizzle-orm";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateContentWithOpenRouter(prompt: string) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://uplift.app",
      "X-Title": "Uplift Industry Insights Generator"
    },
    body: JSON.stringify({
      model: "qwen/qwen3-235b-a22b:free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter API error response:", errorText);
    console.error("Response status:", response.status);
    console.error("Response status text:", response.statusText);
    throw new Error(`OpenRouter API error (${response.status}): ${response.statusText}. Response: ${errorText}`);
  }

  const result = await response.json();
  return result.choices[0]?.message?.content || "";
}

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

      const text = await generateContentWithOpenRouter(prompt);
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