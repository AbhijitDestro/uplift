"use server"

import { db } from "@/lib/dizzle/client"
import { interview, feedback } from "@/lib/dizzle/schema"
import { eq, desc } from "drizzle-orm"
// import { GoogleGenerativeAI } from "@google/generative-ai"
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Validate that the API key is set
if (!OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY is not set in environment variables!");
    throw new Error("OPENROUTER_API_KEY is not configured. Please check your environment variables.");
}

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function generateContentWithOpenRouter(prompt: string) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://uplift.app",
      "X-Title": "Uplift Interview Feedback Generator"
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
  return { response: { text: () => result.choices[0]?.message?.content || "" } };
}

export async function createInterview(data: {
    userId: string,
    jobRole: string,
    company?: string,
    interviewType: string,
    techStack?: string
}) {
    const [newInterview] = await db.insert(interview).values({
        id: crypto.randomUUID(),
        userId: data.userId,
        jobRole: data.jobRole,
        company: data.company,
        interviewType: data.interviewType,
        techStack: data.techStack,
        status: "started"
    }).returning();
    
    return newInterview;
}

export async function getInterview(id: string) {
    const result = await db.select().from(interview).where(eq(interview.id, id));
    return result[0];
}

export async function getUserInterviews(userId: string) {
    return await db.select().from(interview)
        .where(eq(interview.userId, userId))
        .orderBy(desc(interview.createdAt));
}

export async function deleteInterview(id: string) {
    await db.delete(interview).where(eq(interview.id, id));
}

export async function generateFeedback(interviewId: string, transcript: any[]) {
    // 1. Save transcript
    await db.update(interview)
        .set({ transcript, status: "completed" })
        .where(eq(interview.id, interviewId));

    const interviewData = await getInterview(interviewId);
    
    const prompt = `
    You are an expert technical interviewer. Analyze the following interview transcript for a candidate applying for:
    Role: ${interviewData.jobRole}
    Company: ${interviewData.company || "General"}
    Type: ${interviewData.interviewType}
    Tech Stack: ${interviewData.techStack || "N/A"}

    Transcript:
    ${JSON.stringify(transcript)}

    Provide a detailed evaluation in strict JSON format with the following structure:
    {
        "totalScore": number (0-100),
        "categoryScores": [
            { "name": "Communication", "score": number, "comment": "string" },
            { "name": "Technical Accuracy", "score": number, "comment": "string" },
            { "name": "Problem Solving", "score": number, "comment": "string" }
        ],
        "strengths": ["string", "string", ...],
        "areasForImprovement": ["string", "string", ...],
        "finalAssessment": "string (paragraph summary)"
    }
    Do not include markdown formatting like \`\`\`json. Just return the raw JSON string.
    `;

    const result = await generateContentWithOpenRouter(prompt);
    const response = result.response;
    const text = response.text();
    
    // Clean up markdown code blocks if present (just in case)
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let feedbackData;
    try {
        feedbackData = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse OpenRouter response:", text);
        throw new Error("Failed to generate feedback");
    }

    // 3. Save feedback
    const [newFeedback] = await db.insert(feedback).values({
        id: crypto.randomUUID(),
        interviewId,
        userId: interviewData.userId,
        totalScore: feedbackData.totalScore,
        categoryScores: feedbackData.categoryScores,
        strengths: feedbackData.strengths,
        areasForImprovement: feedbackData.areasForImprovement,
        finalAssessment: feedbackData.finalAssessment
    }).returning();

    return newFeedback;
}

export async function getFeedback(interviewId: string) {
    const result = await db.select().from(feedback).where(eq(feedback.interviewId, interviewId));
    return result[0];
}
