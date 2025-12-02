"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { authClient } from "@/lib/auth-client"
import { analyzeResume, getUserResumes, deleteResume } from "@/app/actions/resume"
import { Loader2, Upload, FileText, Trash2, Eye, CheckCircle, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import * as pdfjsLib from 'pdfjs-dist'
import { motion } from 'framer-motion'

// Configure PDF.js worker
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;
}

const ResumeAnalyzerPage = () => {
    const router = useRouter()
    const { data: session } = authClient.useSession()
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [jobDescription, setJobDescription] = useState('')
    const [recentAnalyses, setRecentAnalyses] = useState<any[]>([])
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        console.log("Session updated:", session);
        if (session?.user?.id) {
            loadAnalyses()
        }
    }, [session?.user?.id])

    const loadAnalyses = async () => {
        if (session?.user?.id) {
            const analyses = await getUserResumes(session.user.id)
            setRecentAnalyses(analyses)
        }
    }

    const extractTextFromPDF = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        let fullText = ''

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ')
            fullText += pageText + '\n'
        }

        return fullText.trim()
    }

    const validateAndSetFile = (file: File) => {
        if (file.type !== 'application/pdf') {
            toast.error('Please upload a PDF file')
            return false
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('File size must be less than 5MB')
            return false
        }
        setResumeFile(file)
        return true
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            validateAndSetFile(file)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            validateAndSetFile(file)
        }
    }

    const handleClickUpload = () => {
        document.getElementById('resume')?.click()
    }

    const handleAnalyze = async () => {
        console.log("=== ANALYZE BUTTON CLICKED ===")
        console.log("Session:", session)
        console.log("Resume File:", resumeFile)
        console.log("Job Description:", jobDescription)

        if (!session?.user?.id) {
            console.error("No user session found")
            toast.error("Please sign in to analyze your resume")
            return
        }
        if (!resumeFile) {
            console.error("No resume file selected")
            toast.error("Please upload a resume")
            return
        }

        setIsAnalyzing(true)
        console.log("Starting analysis...")

        try {
            // Extract text from PDF
            console.log("Step 1: Extracting text from PDF...")
            toast.info("Extracting text from PDF...")
            const resumeText = await extractTextFromPDF(resumeFile)
            console.log("Extracted text length:", resumeText.length)
            console.log("First 200 chars:", resumeText.substring(0, 200))
            
            if (!resumeText || resumeText.length < 100) {
                console.error("Insufficient text extracted:", resumeText.length)
                toast.error("Could not extract enough text from PDF. Please ensure it's a valid resume.")
                setIsAnalyzing(false)
                return
            }

            // Analyze with AI
            console.log("Step 2: Analyzing with AI...")
            toast.info("Analyzing resume with AI...")
            
            const analysisData = {
                userId: session.user.id,
                fileName: resumeFile.name,
                resumeText,
                jobDescription: jobDescription.trim() || undefined
            }
            console.log("Analysis data:", { ...analysisData, resumeText: `${resumeText.length} chars` })
            
            console.log("Calling analyzeResume with data:", { ...analysisData, resumeText: `${analysisData.resumeText.length} chars` });
            const analysis = await analyzeResume(analysisData)
            console.log("Analysis result:", analysis)

            toast.success("Resume analyzed successfully!")
            console.log("Navigating to:", `/resume-analyzer/${analysis.id}`)
            router.push(`/resume-analyzer/${analysis.id}`)
        } catch (error: any) {
            console.error("=== ANALYSIS ERROR ===")
            console.error("Error type:", error.constructor.name)
            console.error("Error message:", error.message)
            console.error("Error stack:", error.stack)
            console.error("Full error:", error)
            
            // Provide more detailed error message
            const errorMessage = error.message || "Failed to analyze resume. Please try again.";
            toast.error(errorMessage)
            setIsAnalyzing(false)
        }
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm("Are you sure you want to delete this analysis?")) {
            await deleteResume(id)
            loadAnalyses()
            toast.success("Analysis deleted")
        }
    }

    const handleView = (id: string) => {
        router.push(`/resume-analyzer/${id}`)
    }

    return (
        <div className="min-h-screen w-full p-4 md:p-8 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto space-y-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Resume Analysis</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Resume Analyzer
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Get instant ATS compatibility scores and detailed feedback to optimize your resume for any job.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <Card className="border-0 shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Upload className="h-6 w-6 text-purple-500" />
                                    Upload Resume
                                </CardTitle>
                                <CardDescription>Upload your resume and optionally add a job description for targeted analysis</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="resume" className="text-base">Resume (PDF)</Label>
                                    <div 
                                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                            isDragging 
                                                ? 'border-primary bg-primary/5' 
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            type="file"
                                            id="resume"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        {resumeFile ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <FileText className="h-12 w-12 text-primary" />
                                                <div>
                                                    <p className="font-medium">{resumeFile.name}</p>
                                                    <p className="text-sm text-muted-foreground">{(resumeFile.size / 1024).toFixed(2)} KB</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button 
                                                        type="button" 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={handleClickUpload}
                                                    >
                                                        Change File
                                                    </Button>
                                                    <Button 
                                                        type="button" 
                                                        variant="destructive" 
                                                        size="sm"
                                                        onClick={() => setResumeFile(null)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div 
                                                className="cursor-pointer"
                                                onClick={handleClickUpload}
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <Upload className="h-12 w-12 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">Click to upload or drag and drop</p>
                                                        <p className="text-sm text-muted-foreground">PDF files only, max 5MB</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jobDescription" className="text-base">Job Description (Optional)</Label>
                                    <Textarea
                                        id="jobDescription"
                                        placeholder="Paste the job description here for targeted analysis and keyword matching..."
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        className="min-h-[150px] bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground">Adding a job description will provide keyword matching and role-specific feedback</p>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 rounded-xl"
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing || !resumeFile}
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Analyzing Resume...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-2 h-5 w-5" />
                                                Analyze Resume
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Recent Analyses</h2>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                                {recentAnalyses.length === 0 ? (
                                    <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                                        <CardContent className="p-8 text-center">
                                            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4 mx-auto">
                                                <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No analyses yet</h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Upload your first resume to get started</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    recentAnalyses.map((analysis) => (
                                        <Card
                                            key={analysis.id}
                                            className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all cursor-pointer group"
                                            onClick={() => handleView(analysis.id)}
                                        >
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{analysis.fileName}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            {analysis.jobDescription ? 'With Job Description' : 'General Analysis'}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                            onClick={(e) => handleDelete(analysis.id, e)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 text-xs">
                                                    <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded-full font-semibold">
                                                        ATS: {analysis.atsScore?.toFixed(0)}%
                                                    </span>
                                                    {analysis.analysis?.overallScore && (
                                                        <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded-full font-semibold">
                                                            Overall: {analysis.analysis.overallScore.toFixed(0)}%
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-800 mt-2">
                                                    {new Date(analysis.createdAt).toLocaleDateString()} • {new Date(analysis.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default ResumeAnalyzerPage