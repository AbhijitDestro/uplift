import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./dizzle/client"; // your drizzle instance

import * as schema from "./dizzle/schema";

export const auth = betterAuth({
    emailAndPassword: { 
        enabled: true, 
    }, 
    socialProviders: { 
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID || "", 
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "", 
        }, 
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID || "", 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "", 
        }, 
    }, 
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: schema
    }),
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || process.env.BETTER_AUTH_URL || "https://uplift-self.vercel.app",
    emailVerification: {
        sendOnSignUp: true,
    },
    account: {
        accountLinking: {
            enabled: true,
        }
    }
});