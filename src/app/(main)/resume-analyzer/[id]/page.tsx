"use client"

import { useEffect, useState } from "react"
import { getResume } from "@/app/actions/resume"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, TrendingUp, Award, Download, Share2, Sparkles, Target, BookOpen, Briefcase, User, ChevronRight } from "lucide-react"
import { redirect, useParams } from "next/navigation"
import { motion } from "framer-motion"

export default function ResumeAnalysisPage() {
    const params = useParams()
    const id = params.id as string
    const [resume, setResume] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [animatedScores, setAnimatedScores] = useState({
        overall: 0,
        ats: 0,
        education: 0,
        experience: 0,
        summary: 0
    })

    useEffect(() => {
        async function loadResume() {
            const data = await getResume(id)
            if (!data || !data.analysis) {
                redirect("/resume-analyzer")
            }
            setResume(data)
            setLoading(false)
        }
        loadResume()
    }, [id])

    // Animate scores when resume loads
    useEffect(() => {
        if (resume?.analysis) {
            const duration = 1500 // 1.5 seconds
            const steps = 60 // 60 frames
            const interval = duration / steps

            let currentStep = 0
            const timer = setInterval(() => {
                currentStep++
                const progress = currentStep / steps

                setAnimatedScores({
                    overall: Math.round(resume.analysis.overallScore * progress),
                    ats: Math.round(resume.analysis.atsScore * progress),
                    education: Math.round(resume.analysis.educationScore * progress),
                    experience: Math.round(resume.analysis.experienceScore * progress),
                    summary: Math.round(resume.analysis.summaryScore * progress)
                })

                if (currentStep >= steps) {
                    clearInterval(timer)
                    // Set final values to ensure accuracy
                    setAnimatedScores({
                        overall: resume.analysis.overallScore,
                        ats: resume.analysis.atsScore,
                        education: resume.analysis.educationScore,
                        experience: resume.analysis.experienceScore,
                        summary: resume.analysis.summaryScore
                    })
                }
            }, interval)

            return () => clearInterval(timer)
        }
    }, [resume])

    if (loading || !resume) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading analysis...</p>
                </div>
            </div>
        )
    }

    const analysis = resume.analysis

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-600 dark:text-emerald-400"
        if (score >= 60) return "text-amber-600 dark:text-amber-400"
        return "text-rose-600 dark:text-rose-400"
    }

    const getScoreGradient = (score: number) => {
        if (score >= 80) return "from-emerald-500 to-teal-500"
        if (score >= 60) return "from-amber-500 to-orange-500"
        return "from-rose-500 to-pink-500"
    }

    const getScoreBadge = (score: number) => {
        if (score >= 80) return { label: "Excellent", color: "bg-emerald-500" }
        if (score >= 60) return { label: "Good", color: "bg-amber-500" }
        return { label: "Needs Work", color: "bg-rose-500" }
    }

    const scoreMetrics = [
        { label: "ATS Score", value: analysis.atsScore, animatedValue: animatedScores.ats, icon: Target, description: "Applicant Tracking System compatibility" },
        { label: "Education", value: analysis.educationScore, animatedValue: animatedScores.education, icon: BookOpen, description: "Quality of education section" },
        { label: "Experience", value: analysis.experienceScore, animatedValue: animatedScores.experience, icon: Briefcase, description: "Work experience presentation" },
        { label: "Summary", value: analysis.summaryScore, animatedValue: animatedScores.summary, icon: User, description: "Professional summary quality" },
    ]

    return (
        <div className="min-h-screen w-full relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
            </div>

            <div className="container mx-auto py-8 px-4 space-y-8 max-w-7xl">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-4"
                >
                    <Button variant="ghost" size="icon" asChild className="mt-1">
                        <Link href="/resume-analyzer"><ArrowLeft /></Link>
                    </Button>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                                    Resume Analysis
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1">{resume.fileName}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Overall Score - Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${getScoreGradient(analysis.overallScore)}`} />
                        <CardContent className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="relative">
                                    <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${getScoreGradient(analysis.overallScore)} p-1 shadow-2xl`}>
                                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className={`text-5xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                                                    {animatedScores.overall}
                                                </div>
                                                <div className="text-sm text-muted-foreground font-medium">out of 100</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`absolute -top-2 -right-2 ${getScoreBadge(analysis.overallScore).color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                                        {getScoreBadge(analysis.overallScore).label}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Overall Assessment</h2>
                                        <p className="text-muted-foreground text-lg">
                                            {analysis.overallScore >= 80 
                                                ? "Outstanding! Your resume is well-optimized and ready to impress recruiters." 
                                                : analysis.overallScore >= 60 
                                                ? "Good foundation! A few improvements will make your resume stand out even more." 
                                                : "There's room for improvement. Follow the suggestions below to enhance your resume."}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Download className="w-4 h-4" />
                                            Export Report
                                        </Button>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Share2 className="w-4 h-4" />
                                            Share
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Score Breakdown */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {scoreMetrics.map((metric, index) => {
                        const badge = getScoreBadge(metric.value)
                        const circumference = 2 * Math.PI * 45 // radius = 45
                        const strokeDashoffset = circumference - (metric.animatedValue / 100) * circumference
                        
                        return (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                <Card className="border-0 shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
                                    {/* Gradient accent line */}
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getScoreGradient(metric.value)}`} />
                                    
                                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                        {/* Circular Progress */}
                                        <div className="relative w-32 h-32">
                                            {/* Background circle */}
                                            <svg className="w-32 h-32 transform -rotate-90">
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="45"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    className="text-gray-200 dark:text-gray-700"
                                                />
                                                {/* Progress circle */}
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="45"
                                                    stroke={`url(#gradient-${index})`}
                                                    strokeWidth="8"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={strokeDashoffset}
                                                    className="transition-all duration-75 ease-out"
                                                />
                                                <defs>
                                                    <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" className={metric.value >= 80 ? "text-emerald-500" : metric.value >= 60 ? "text-amber-500" : "text-rose-500"} stopColor="currentColor" />
                                                        <stop offset="100%" className={metric.value >= 80 ? "text-teal-500" : metric.value >= 60 ? "text-orange-500" : "text-pink-500"} stopColor="currentColor" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            
                                            {/* Center content */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <metric.icon className={`h-6 w-6 mb-1 ${getScoreColor(metric.value)}`} />
                                                <div className={`text-2xl font-bold ${getScoreColor(metric.value)}`}>
                                                    {metric.animatedValue}
                                                </div>
                                                <div className="text-xs text-muted-foreground font-medium">/ 100</div>
                                            </div>
                                        </div>

                                        {/* Label and description */}
                                        <div className="space-y-1">
                                            <div className="font-bold text-base">{metric.label}</div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{metric.description}</p>
                                        </div>

                                        {/* Badge */}
                                        <div className={`${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm`}>
                                            {badge.label}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Detailed Feedback */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                        <CardHeader className="border-b bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10">
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                AI-Powered Insights
                            </CardTitle>
                            <CardDescription>Comprehensive analysis of your resume</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-foreground/90 leading-relaxed text-base">{analysis.detailedFeedback}</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Keywords Section */}
                {resume.jobDescription && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        <Card className="border-0 shadow-xl bg-emerald-50/50 dark:bg-emerald-900/10 backdrop-blur-sm overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                    <CheckCircle2 className="h-5 w-5" />
                                    Matching Keywords
                                    <span className="ml-auto text-sm bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                                        {analysis.matchingKeywords.length}
                                    </span>
                                </CardTitle>
                                <CardDescription>Keywords found in your resume</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.matchingKeywords.map((keyword: string, i: number) => (
                                        <motion.span 
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5 + i * 0.05 }}
                                            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            {keyword}
                                        </motion.span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-xl bg-rose-50/50 dark:bg-rose-900/10 backdrop-blur-sm overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 text-rose-700 dark:text-rose-400">
                                    <AlertCircle className="h-5 w-5" />
                                    Missing Keywords
                                    <span className="ml-auto text-sm bg-rose-600 text-white px-2 py-0.5 rounded-full">
                                        {analysis.missingKeywords.length}
                                    </span>
                                </CardTitle>
                                <CardDescription>Important keywords to add</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.missingKeywords.map((keyword: string, i: number) => (
                                        <motion.span 
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5 + i * 0.05 }}
                                            className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            {keyword}
                                        </motion.span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Strengths and Improvements */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid md:grid-cols-2 gap-6"
                >
                    <Card className="border-0 shadow-xl bg-blue-50/50 dark:bg-blue-900/10 backdrop-blur-sm overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <CheckCircle2 className="h-5 w-5" />
                                Key Strengths
                            </CardTitle>
                            <CardDescription>What your resume does well</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {analysis.strengths.map((strength: string, i: number) => (
                                    <motion.li 
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + i * 0.1 }}
                                        className="flex gap-3 items-start p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                        <span className="text-foreground/90 text-sm">{strength}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-amber-50/50 dark:bg-amber-900/10 backdrop-blur-sm overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                <TrendingUp className="h-5 w-5" />
                                Improvement Areas
                            </CardTitle>
                            <CardDescription>Suggestions to enhance your resume</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {analysis.improvements.map((improvement: string, i: number) => (
                                    <motion.li 
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + i * 0.1 }}
                                        className="flex gap-3 items-start p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <ChevronRight className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                        <span className="text-foreground/90 text-sm">{improvement}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Actions */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row justify-center gap-4 pt-8 pb-12"
                >
                    <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                        <Link href="/resume-analyzer">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Analyze Another Resume
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                </motion.div>
            </div>
        </div>
    )
}
