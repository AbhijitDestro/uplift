import { getAssessment } from "@/app/actions/assessment"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, ArrowLeft, Target, Clock, TrendingUp } from "lucide-react"
import { redirect } from "next/navigation"

export default async function FeedbackPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const assessment = await getAssessment(id)

    if (!assessment || assessment.status !== 'completed') {
        redirect(`/practice-interviews/mock-assessment/${id}`)
    }

    const correctCount = assessment.questions.filter((q: any) => q.isCorrect).length
    const totalQuestions = assessment.questions.length
    const accuracy = (correctCount / totalQuestions) * 100
    const avgTimePerQuestion = Math.floor((Date.now() - new Date(assessment.createdAt).getTime()) / 1000 / totalQuestions)

    return (
        <div className="container mx-auto py-8 space-y-8 max-w-5xl">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/practice-interviews/mock-assessment"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-bold">Assessment Results</h1>
            </div>

            {/* Score Overview */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-900/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                            {assessment.quizScore?.toFixed(1)}%
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {correctCount} out of {totalQuestions} correct
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-900/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Accuracy
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                            {accuracy.toFixed(0)}%
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {assessment.level} Level
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-900/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Avg. Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                            {avgTimePerQuestion}s
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Per question
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Improvement Tip */}
            {assessment.improvementTip && (
                <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-400">
                            <TrendingUp className="h-5 w-5" />
                            Personalized Improvement Tip
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground/90 leading-relaxed">{assessment.improvementTip}</p>
                    </CardContent>
                </Card>
            )}

            {/* Question Review */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Question Review</h2>
                <div className="space-y-4">
                    {assessment.questions.map((q: any, index: number) => (
                        <Card key={index} className={`overflow-hidden ${q.isCorrect ? 'border-green-200 dark:border-green-900/50' : 'border-red-200 dark:border-red-900/50'}`}>
                            <CardHeader className={`${q.isCorrect ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'}`}>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg font-semibold">
                                        Question {index + 1}
                                    </CardTitle>
                                    {q.isCorrect ? (
                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                            <CheckCircle2 className="h-5 w-5" />
                                            <span className="font-semibold">Correct</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                            <XCircle className="h-5 w-5" />
                                            <span className="font-semibold">Incorrect</span>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <p className="text-lg font-medium">{q.question}</p>
                                
                                <div className="space-y-2">
                                    {q.options.map((option: string, optIndex: number) => {
                                        const isCorrectAnswer = option === q.answer
                                        const isUserAnswer = option === q.userAnswer
                                        
                                        return (
                                            <div
                                                key={optIndex}
                                                className={`p-3 rounded-lg border-2 ${
                                                    isCorrectAnswer
                                                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                                        : isUserAnswer && !isCorrectAnswer
                                                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                                                        : 'border-border bg-muted/30'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className={isCorrectAnswer || (isUserAnswer && !isCorrectAnswer) ? 'font-semibold' : ''}>
                                                        {option}
                                                    </span>
                                                    {isCorrectAnswer && (
                                                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                                                            Correct Answer
                                                        </span>
                                                    )}
                                                    {isUserAnswer && !isCorrectAnswer && (
                                                        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                                                            Your Answer
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {!q.userAnswer && (
                                    <p className="text-sm text-muted-foreground italic">You did not answer this question.</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 pt-8 pb-12">
                <Button variant="outline" size="lg" asChild className="px-8">
                    <Link href="/practice-interviews/mock-assessment">Back to Dashboard</Link>
                </Button>
                <Button size="lg" asChild className="px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    <Link href="/practice-interviews/mock-assessment">Take Another Test</Link>
                </Button>
            </div>
        </div>
    )
}
