"use server"
import { db } from "@/lib/dizzle/client";
import { user } from "@/lib/dizzle/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(data: {
    jobTitle?: string;
    companyName?: string;
    yearsOfExperience?: number;
    industryName?: string;
    keySkills?: string[];
    image?: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) throw new Error("Unauthorized");

    const updateData: Partial<typeof user.$inferInsert> = {};
    if (data.jobTitle !== undefined) updateData.jobTitle = data.jobTitle;
    if (data.companyName !== undefined) updateData.companyName = data.companyName;
    if (data.yearsOfExperience !== undefined) updateData.yearsOfExperience = data.yearsOfExperience;
    if (data.industryName !== undefined) updateData.industryName = data.industryName;
    if (data.keySkills !== undefined) updateData.keySkills = data.keySkills;
    if (data.image !== undefined) updateData.image = data.image;

    await db.update(user).set(updateData).where(eq(user.id, session.user.id));

    revalidatePath("/profile");
    return { success: true };
}

export async function getUserProfile() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) return null;

    const userData = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1);
    return userData[0] || null;
}
