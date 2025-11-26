import { getResume } from "@/app/actions/resume"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, TrendingUp, Award } from "lucide-react"
import { redirect } from "next/navigation"

export default async function ResumeAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const resume = await getResume(id)

    if (!resume || !resume.analysis) {
        redirect("/resume-analyzer")
    }

    const analysis = resume.analysis

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 dark:text-green-400"
        if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
        return "text-red-600 dark:text-red-400"
    }

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-green-100 dark:bg-green-900/30"
        if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/30"
        return "bg-red-100 dark:bg-red-900/30"
    }

    return (
        <div className="container mx-auto py-8 space-y-8 max-w-6xl">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/resume-analyzer"><ArrowLeft /></Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">Resume Analysis Results</h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <FileText className="h-4 w-4" />
                        {resume.fileName}
                    </p>
                </div>
            </div>

            {/* Overall Score Card */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-200 dark:border-purple-900/50">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Award className="h-6 w-6 text-purple-600" />
                        Overall Assessment
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-6">
                        <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                            {analysis.overallScore}
                            <span className="text-2xl text-muted-foreground font-normal">/100</span>
                        </div>
                        <div className="flex-1">
                            <Progress value={analysis.overallScore} className="h-3" />
                            <p className="text-sm text-muted-foreground mt-2">
                                {analysis.overallScore >= 80 ? "Excellent resume!" : analysis.overallScore >= 60 ? "Good resume with room for improvement" : "Needs significant improvement"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Score Breakdown */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className={getScoreBg(analysis.atsScore)}>
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-muted-foreground mb-2">ATS Compatibility</div>
                        <div className={`text-3xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                            {analysis.atsScore}%
                        </div>
                        <Progress value={analysis.atsScore} className="mt-3 h-2" />
                    </CardContent>
                </Card>

                <Card className={getScoreBg(analysis.educationScore)}>
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Education</div>
                        <div className={`text-3xl font-bold ${getScoreColor(analysis.educationScore)}`}>
                            {analysis.educationScore}%
                        </div>
                        <Progress value={analysis.educationScore} className="mt-3 h-2" />
                    </CardContent>
                </Card>

                <Card className={getScoreBg(analysis.experienceScore)}>
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Experience</div>
                        <div className={`text-3xl font-bold ${getScoreColor(analysis.experienceScore)}`}>
                            {analysis.experienceScore}%
                        </div>
                        <Progress value={analysis.experienceScore} className="mt-3 h-2" />
                    </CardContent>
                </Card>

                <Card className={getScoreBg(analysis.summaryScore)}>
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Summary</div>
                        <div className={`text-3xl font-bold ${getScoreColor(analysis.summaryScore)}`}>
                            {analysis.summaryScore}%
                        </div>
                        <Progress value={analysis.summaryScore} className="mt-3 h-2" />
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Feedback */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Detailed Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90 leading-relaxed">{analysis.detailedFeedback}</p>
                </CardContent>
            </Card>

            {/* Keywords Section */}
            {resume.jobDescription && (
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                                <CheckCircle2 className="h-5 w-5" />
                                Matching Keywords ({analysis.matchingKeywords.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {analysis.matchingKeywords.map((keyword: string, i: number) => (
                                    <span key={i} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                                <AlertCircle className="h-5 w-5" />
                                Missing Keywords ({analysis.missingKeywords.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {analysis.missingKeywords.map((keyword: string, i: number) => (
                                    <span key={i} className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Strengths and Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
                            <CheckCircle2 className="h-5 w-5" />
                            Strengths
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {analysis.strengths.map((strength: string, i: number) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                                    <span className="text-foreground/90">{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-400">
                            <AlertCircle className="h-5 w-5" />
                            Areas for Improvement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {analysis.improvements.map((improvement: string, i: number) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-600 shrink-0" />
                                    <span className="text-foreground/90">{improvement}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 pt-8 pb-12">
                <Button variant="outline" size="lg" asChild className="px-8">
                    <Link href="/resume-analyzer">Analyze Another Resume</Link>
                </Button>
            </div>
        </div>
    )
}
