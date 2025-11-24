import { auth } from "@/lib/auth"; // Make sure this path matches where you created auth.ts
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);