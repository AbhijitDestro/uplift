import { getFeedback, getInterview } from "@/app/actions/interview"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"

export default async function FeedbackPage({ params }: { params: Promise<{ session: string }> }) {
    const { session: sessionId } = await params
    const feedback = await getFeedback(sessionId)
    const interview = await getInterview(sessionId)

    if (!feedback) {
        return (
            <div className="container mx-auto py-10 text-center">
                <h1 className="text-2xl font-bold mb-4">Feedback Not Found</h1>
                <p className="mb-6">We couldn't find feedback for this session. It might still be generating or the session was not completed.</p>
                <Button asChild>
                    <Link href="/practice-interviews/voice-interview">Back to Dashboard</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 space-y-8 max-w-4xl">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/practice-interviews/voice-interview"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-bold">Interview Feedback</h1>
            </div>

            <Card className="bg-gradient-to-br from-background to-muted border-primary/10 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl text-muted-foreground">Overall Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-6">
                        <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            {feedback.totalScore}
                            <span className="text-2xl text-muted-foreground font-normal">/100</span>
                        </div>
                        <div className="border-l pl-6 space-y-1">
                            <p className="font-semibold text-lg">{interview?.jobRole}</p>
                            <p className="text-muted-foreground">{interview?.company || "General Practice"}</p>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground/70">{interview?.interviewType}</p>
                        </div>
                    </div>
                    <p className="text-lg leading-relaxed pt-4 border-t">{feedback.finalAssessment}</p>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            <CheckCircle2 className="h-5 w-5" /> Strengths
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {feedback.strengths.map((s: string, i: number) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-600 shrink-0" />
                                    <span className="text-foreground/90">{s}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                            <AlertCircle className="h-5 w-5" /> Areas for Improvement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {feedback.areasForImprovement.map((s: string, i: number) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-600 shrink-0" />
                                    <span className="text-foreground/90">{s}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Category Breakdown</h2>
                <div className="grid gap-4">
                    {feedback.categoryScores.map((cat: any, i: number) => (
                        <Card key={i} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-lg">{cat.name}</h3>
                                    <span className={`font-bold ${cat.score >= 70 ? 'text-green-600' : cat.score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                                        {cat.score}/100
                                    </span>
                                </div>
                                <div className="w-full bg-secondary h-2 rounded-full mb-3">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${cat.score >= 70 ? 'bg-green-500' : cat.score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                        style={{ width: `${cat.score}%` }}
                                    />
                                </div>
                                <p className="text-muted-foreground text-sm">{cat.comment}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="flex justify-center pt-8 pb-12">
                <Button size="lg" asChild className="px-8 h-12 text-lg rounded-xl shadow-lg hover:shadow-primary/25 transition-all">
                    <Link href="/practice-interviews/voice-interview">Start New Session</Link>
                </Button>
            </div>
        </div>
    )
}