"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Validate that the API key is set
if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables!");
    throw new Error("GEMINI_API_KEY is not configured. Please check your environment variables.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateLinkedInContent(data: {
    role: string;
    skills: string;
}) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = `
        You are a LinkedIn profile optimization expert. Create a catchy, SEO-friendly headline and a professional summary for a user with the following details:
        
        Role: ${data.role}
        Skills: ${data.skills}

        Provide the output in strict JSON format with the following structure:
        {
            "headline": "string (max 220 chars, use keywords and emojis if appropriate)",
            "summary": "string (professional first-person summary, max 2000 chars, engaging and highlighting key skills)"
        }
        Do not include markdown formatting like \`\`\`json. Just return the raw JSON string.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const content = JSON.parse(jsonStr);

        return content;
    } catch (error) {
        console.error("Error generating LinkedIn content:", error);
        throw new Error("Failed to generate LinkedIn content");
    }
}