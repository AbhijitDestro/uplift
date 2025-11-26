import { getAssessment } from "@/app/actions/assessment"
import AssessmentSession from "@/components/mock-assessment/AssessmentSession"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth.api.getSession({
        headers: await headers()
    })
    
    if (!session) {
        redirect("/sign-in")
    }

    const assessment = await getAssessment(id)
    
    if (!assessment) {
        redirect("/practice-interviews/mock-assessment")
    }

    // If already completed, redirect to feedback
    if (assessment.status === 'completed') {
        redirect(`/practice-interviews/mock-assessment/${id}/feedback`)
    }

    return <AssessmentSession assessment={assessment} />
}
