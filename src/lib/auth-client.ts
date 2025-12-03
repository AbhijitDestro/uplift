import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || process.env.BETTER_AUTH_URL || "https://uplift-self.vercel.app",
})

export const { signIn, signUp, useSession } = authClient