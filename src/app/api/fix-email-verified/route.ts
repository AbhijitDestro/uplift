import { NextResponse } from "next/server";
import { db } from "@/lib/dizzle/client";
import { user } from "@/lib/dizzle/schema";

/**
 * API endpoint to update emailVerified field for all users
 * This is a one-time fix for users who signed up before email verification was disabled
 * 
 * Usage: Navigate to http://localhost:3000/api/fix-email-verified
 */
export async function GET() {
  try {
    console.log("Starting to update emailVerified field for all users...");
    
    // Update all users to have emailVerified = true
    const result = await db
      .update(user)
      .set({ emailVerified: true })
      .execute();
    
    console.log("✅ Successfully updated all users!");
    
    // Get all users to verify
    const users = await db.select().from(user);
    
    return NextResponse.json({
      success: true,
      message: "Successfully updated all users",
      updatedCount: result.rowCount || 0,
      users: users.map((u) => ({
        email: u.email,
        emailVerified: u.emailVerified,
      })),
    });
    
  } catch (error) {
    console.error("❌ Error updating users:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
