"use server";

import { db } from "@/lib/dizzle/client";
import { resume } from "@/lib/dizzle/schema";
import { eq, desc } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Validate that the API key is set
if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables!");
    throw new Error("GEMINI_API_KEY is not configured. Please check your environment variables.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function analyzeResume(data: {
    userId: string,
    fileName: string,
    resumeText: string,
    jobDescription?: string
}) {
    console.log("=== SERVER: analyzeResume called ===");
    console.log("User ID:", data.userId);
    console.log("File name:", data.fileName);
    console.log("Resume text length:", data.resumeText.length);
    console.log("Has job description:", !!data.jobDescription);

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach. Analyze the following resume ${data.jobDescription ? 'against the job description' : ''}.
    
    Resume Content:
    ${data.resumeText}
    
    ${data.jobDescription ? `Job Description:\n${data.jobDescription}` : ''}
    
    Provide a comprehensive analysis in the following JSON format (return ONLY valid JSON, no markdown):
    {
        "overallScore": <number 0-100>,
        "atsScore": <number 0-100>,
        "educationScore": <number 0-100>,
        "experienceScore": <number 0-100>,
        "summaryScore": <number 0-100>,
        "matchingKeywords": [<array of keywords found in resume that match job description>],
        "missingKeywords": [<array of important keywords missing from resume>],
        "strengths": [<array of 3-5 strength points>],
        "improvements": [<array of 3-5 improvement suggestions>],
        "detailedFeedback": "<detailed paragraph explaining the analysis>"
    }
    
    Scoring Criteria:
    - ATS Score: How well the resume is formatted for ATS systems (keywords, structure, formatting)
    - Education Score: Quality and relevance of education section
    - Experience Score: Quality, relevance, and presentation of work experience
    - Summary Score: Quality of professional summary/objective
    - Overall Score: Weighted average of all scores
    
    ${!data.jobDescription ? 'Since no job description is provided, focus on general resume quality, ATS compatibility, and professional presentation.' : ''}`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log("Gemini Response:", text);
        
        // Clean up markdown code blocks if present
        let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // Extract JSON from response
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }
        
        let analysis;
        try {
            analysis = JSON.parse(jsonStr);
            console.log("Successfully parsed AI response");
        } catch (e) {
            console.error("Failed to parse AI response as JSON");
            console.error("Cleaned JSON string:", jsonStr);
            console.error("Parse error:", e);
            throw new Error("Failed to parse AI analysis. Please try again.");
        }

        // Save resume analysis to database
        console.log("Saving to database...");
        const [newResume] = await db.insert(resume).values({
            id: crypto.randomUUID(),
            userId: data.userId,
            fileName: data.fileName,
            content: data.resumeText,
            jobDescription: data.jobDescription,
            atsScore: analysis.atsScore,
            analysis: analysis
        }).returning();
        
        console.log("Resume analysis saved with ID:", newResume.id);
        return newResume;
    } catch (error: any) {
        console.error("=== SERVER ERROR in analyzeResume ===");
        console.error("Error type:", error.constructor?.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        throw error;
    }
}

export async function getUserResumes(userId: string) {
    return await db.select().from(resume)
        .where(eq(resume.userId, userId))
        .orderBy(desc(resume.createdAt));
}

export async function getResume(id: string) {
    const result = await db.select().from(resume).where(eq(resume.id, id));
    return result[0];
}

export async function deleteResume(id: string) {
    await db.delete(resume).where(eq(resume.id, id));
}