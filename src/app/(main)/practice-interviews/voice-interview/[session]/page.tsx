import { getInterview } from "@/app/actions/interview"
import InterviewSession from "@/components/voice-interview/InterviewSession"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page({ params }: { params: Promise<{ session: string }> }) {
    const { session: sessionId } = await params
    const session = await auth.api.getSession({
        headers: await headers()
    })
    
    if (!session) {
        redirect("/sign-in")
    }

    const interview = await getInterview(sessionId)
    
    if (!interview) {
        redirect("/practice-interviews/voice-interview")
    }

    return (
        <InterviewSession 
            interview={interview} 
            userId={session.user.id} 
            userName={session.user.name}
            userImage={session.user.image}
        />
    )
}