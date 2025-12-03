/**
 * Script to update emailVerified field for all existing users
 * Run this script once to fix users who signed up before email verification was disabled
 * 
 * Usage: npx tsx scripts/fix-email-verified.ts
 */

import { db } from "../src/lib/dizzle/client";
import { user } from "../src/lib/dizzle/schema";
import { eq } from "drizzle-orm";

async function fixEmailVerified() {
  try {
    console.log("Starting to update emailVerified field for all users...");
    
    // Update all users to have emailVerified = true
    const result = await db
      .update(user)
      .set({ emailVerified: true })
      .execute();
    
    console.log("✅ Successfully updated all users!");
    console.log(`Updated ${result.rowCount || 0} users`);
    
    // Verify the update
    const users = await db.select().from(user);
    console.log("\nCurrent users:");
    users.forEach((u) => {
      console.log(`- ${u.email}: emailVerified = ${u.emailVerified}`);
    });
    
  } catch (error) {
    console.error("❌ Error updating users:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

fixEmailVerified();
