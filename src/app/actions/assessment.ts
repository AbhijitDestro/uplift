"use server"

import { db } from "@/lib/dizzle/client"
import { assessment } from "@/lib/dizzle/schema"
import { eq, desc } from "drizzle-orm"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function createAssessment(data: {
    userId: string,
    topic: string,
    level: string,
    numberOfQuestions: number
}) {
    // Generate questions using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
    Generate exactly ${data.numberOfQuestions} multiple-choice questions for a ${data.level} level assessment on the topic: ${data.topic}.
    
    Return ONLY a valid JSON array with this exact structure (no markdown, no code blocks):
    [
        {
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "The correct option text (must match one of the options exactly)"
        }
    ]
    
    Requirements:
    - Questions should be appropriate for ${data.level} level
    - Each question must have exactly 4 options
    - The answer must be one of the options (exact text match)
    - Return only the JSON array, no other text
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("Gemini Response:", text); // Debug log
    
    // Clean up markdown code blocks if present
    let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Sometimes Gemini adds a prefix like "Here is the JSON..."
    const firstBracket = jsonStr.indexOf('[');
    const lastBracket = jsonStr.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1) {
        jsonStr = jsonStr.substring(firstBracket, lastBracket + 1);
    }
    
    let generatedQuestions;
    try {
        generatedQuestions = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse Gemini response:", text);
        throw new Error("Failed to generate questions: Invalid JSON format");
    }

    console.log("Parsed Questions:", generatedQuestions.length); // Debug log

    // Create assessment with generated questions
    const [newAssessment] = await db.insert(assessment).values({
        id: crypto.randomUUID(),
        userId: data.userId,
        topic: data.topic,
        level: data.level,
        questions: generatedQuestions,
        status: "in_progress"
    }).returning();
    
    console.log("Assessment Created:", newAssessment.id); // Debug log
    
    return newAssessment;
}

export async function getAssessment(id: string) {
    const result = await db.select().from(assessment).where(eq(assessment.id, id));
    return result[0];
}

export async function getUserAssessments(userId: string) {
    return await db.select().from(assessment)
        .where(eq(assessment.userId, userId))
        .orderBy(desc(assessment.createdAt));
}

export async function deleteAssessment(id: string) {
    await db.delete(assessment).where(eq(assessment.id, id));
}

export async function submitAssessment(assessmentId: string, userAnswers: { [key: number]: string }) {
    const assessmentData = await getAssessment(assessmentId);
    
    if (!assessmentData) {
        throw new Error("Assessment not found");
    }

    // Calculate score and update questions with user answers
    const updatedQuestions = assessmentData.questions.map((q: any, index: number) => ({
        ...q,
        userAnswer: userAnswers[index] || "",
        isCorrect: userAnswers[index] === q.answer
    }));

    const correctCount = updatedQuestions.filter((q: any) => q.isCorrect).length;
    const totalQuestions = updatedQuestions.length;
    const score = (correctCount / totalQuestions) * 100;

    // Generate improvement tip using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
    Based on this assessment result:
    - Topic: ${assessmentData.topic}
    - Level: ${assessmentData.level}
    - Score: ${score.toFixed(1)}%
    - Correct: ${correctCount}/${totalQuestions}
    
    Provide a brief (2-3 sentences) personalized improvement tip. Be encouraging but specific about what to focus on.
    Return only the tip text, no formatting.
    `;

    const result = await model.generateContent(prompt);
    const improvementTip = result.response.text().trim();

    // Update assessment
    await db.update(assessment)
        .set({
            questions: updatedQuestions,
            quizScore: score,
            status: "completed",
            improvementTip
        })
        .where(eq(assessment.id, assessmentId));

    return {
        score,
        correctCount,
        totalQuestions,
        improvementTip,
        questions: updatedQuestions
    };
}
