"use server"

import { db } from "@/lib/dizzle/client"
import { resume } from "@/lib/dizzle/schema"
import { eq, desc } from "drizzle-orm"

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;

export async function analyzeResume(data: {
    userId: string,
    fileName: string,
    resumeText: string,
    jobDescription?: string
}) {
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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://uplift.app",
            "X-Title": "Uplift Resume Analyzer"
        },
        body: JSON.stringify({
            model: "deepseek/deepseek-r1-distill-qwen-32b",
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
        console.error("OpenRouter API error:", errorText);
        throw new Error(`Failed to analyze resume: ${response.statusText}`);
    }

    const result = await response.json();
    const text = result.choices[0]?.message?.content || "";
    
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
    } catch (e) {
        console.error("Failed to parse AI response:", text);
        throw new Error("Failed to analyze resume");
    }

    // Save resume analysis to database
    const [newResume] = await db.insert(resume).values({
        id: crypto.randomUUID(),
        userId: data.userId,
        fileName: data.fileName,
        content: data.resumeText,
        jobDescription: data.jobDescription,
        atsScore: analysis.atsScore,
        analysis: analysis
    }).returning();
    
    return newResume;
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
