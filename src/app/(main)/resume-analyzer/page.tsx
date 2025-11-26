"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { authClient } from "@/lib/auth-client"
import { analyzeResume, getUserResumes, deleteResume } from "@/app/actions/resume"
import { Loader2, Upload, FileText, Trash2, Eye, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
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
        if (!session?.user?.id) {
            toast.error("Please sign in to analyze your resume")
            return
        }
        if (!resumeFile) {
            toast.error("Please upload a resume")
            return
        }

        setIsAnalyzing(true)
        try {
            // Extract text from PDF
            toast.info("Extracting text from PDF...")
            const resumeText = await extractTextFromPDF(resumeFile)
            
            if (!resumeText || resumeText.length < 100) {
                toast.error("Could not extract enough text from PDF. Please ensure it's a valid resume.")
                setIsAnalyzing(false)
                return
            }

            // Analyze with AI
            toast.info("Analyzing resume with AI...")
            const analysis = await analyzeResume({
                userId: session.user.id,
                fileName: resumeFile.name,
                resumeText,
                jobDescription: jobDescription.trim() || undefined
            })

            toast.success("Resume analyzed successfully!")
            router.push(`/resume-analyzer/${analysis.id}`)
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Failed to analyze resume")
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
        <div className="space-y-8 container mx-auto py-6">
            <section className='p-4'>
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-primary-foreground w-full p-8 rounded-xl shadow-lg transition-all hover:shadow-xl">
                    <div className="space-y-3">
                        <h1 className='text-4xl font-bold tracking-tight'>AI-Powered Resume Analyzer</h1>
                        <p className="text-lg opacity-90 max-w-2xl">Get instant ATS compatibility scores and detailed feedback to optimize your resume for any job.</p>
                    </div>
                </div>
            </section>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
                <section className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl">Upload Resume</CardTitle>
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
                                    className="min-h-[150px]"
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
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold px-1">Recent Analyses</h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                        {recentAnalyses.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                                <p>No analyses found.</p>
                                <p className="text-sm mt-1">Upload your first resume!</p>
                            </div>
                        ) : (
                            recentAnalyses.map((analysis) => (
                                <Card
                                    key={analysis.id}
                                    className="hover:shadow-md transition-shadow cursor-pointer group"
                                    onClick={() => handleView(analysis.id)}
                                >
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg truncate">{analysis.fileName}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {analysis.jobDescription ? 'With Job Description' : 'General Analysis'}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
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
                                        <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
                                            {new Date(analysis.createdAt).toLocaleDateString()} • {new Date(analysis.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ResumeAnalyzerPage
