"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, AlertCircle, CheckCircle2, ArrowRight, X, Trash2, RefreshCw, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import * as pdfjsLib from "pdfjs-dist";
import { analyzeResume, getUserResumes, deleteResume } from "@/app/actions/resume";
import { useSession } from "@/lib/auth-client";



interface AnalysisResult {
    overallScore: number;
    atsScore: number;
    educationScore: number;
    experienceScore: number;
    summaryScore: number;
    matchingKeywords: string[];
    missingKeywords: string[];
    strengths: string[];
    improvements: string[];
    detailedFeedback: string;
}

interface ResumeEntry {
    id: string;
    fileName: string;
    createdAt: Date;
    atsScore: number | null;
    analysis: unknown;
}

import { useRouter } from "next/navigation";

export default function ResumeAnalyzerPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDragging, setIsDragging] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);
    const [jobDescription, setJobDescription] = React.useState("");
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [recentAnalyses, setRecentAnalyses] = React.useState<ResumeEntry[]>([]);

    // Load recent analyses when session is available
    React.useEffect(() => {
        if (session?.user?.id) {
            loadRecentAnalyses();
        }
    }, [session?.user?.id]);

    const loadRecentAnalyses = async () => {
        if (!session?.user?.id) return;
        try {
            const resumes = await getUserResumes(session.user.id);
            setRecentAnalyses(resumes as ResumeEntry[]);
        } catch (error) {
            console.error("Failed to load recent analyses", error);
        }
    };

    // Helper to extract text from PDF
    // Helper to extract text from PDF with timeout
    const extractTextFromPDF = async (file: File): Promise<string> => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            
            // Set worker source if not already set
            if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
                 pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
            }

            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            
            const pdf = await Promise.race([
                loadingTask.promise,
                new Promise<never>((_, reject) => 
                    setTimeout(() => reject(new Error("PDF loading timed out")), 10000)
                )
            ]);

            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                fullText += pageText + "\n";
            }

            return fullText;
        } catch (error) {
            console.error("Error extracting text from PDF:", error);
            throw error;
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
            } else {
                toast.error("Please upload a PDF file.");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === "application/pdf") {
                setFile(selectedFile);
            } else {
                toast.error("Please upload a PDF file.");
            }
        }
    };

    const removeFile = () => {
        setFile(null);
    };



    const handleAnalyze = async () => {
        if (!file) {
            toast.error("Please upload a resume first.");
            return;
        }

        if (!session?.user?.id) {
            toast.error("Please sign in to analyze your resume.");
            return;
        }

        setIsAnalyzing(true);
        try {
            let text = "";
            try {
                text = await extractTextFromPDF(file);
            } catch (error) {
                console.error("PDF Extraction failed", error);
                toast.error("Failed to read PDF file. Please ensure it's a valid PDF.");
                setIsAnalyzing(false);
                return;
            }

            if (!text || text.trim().length === 0) {
                toast.error("Could not extract text from resume. Please try a different file.");
                setIsAnalyzing(false);
                return;
            }
            
            const result = await analyzeResume({
                userId: session.user.id,
                fileName: file.name,
                resumeText: text,
                jobDescription: jobDescription
            });

            if (!result) {
                 throw new Error("No result returned from analysis");
            }

            toast.success("Resume analyzed successfully!");
            router.push(`/resume/analyzer/${result.id}`);
        } catch (error) {
            console.error("Analysis failed", error);
            toast.error("Failed to analyze resume. Please try again.");
            setIsAnalyzing(false);
        }
    };

    const handleDeleteAnalysis = async (id: string) => {
        try {
            await deleteResume(id);
            toast.success("Analysis deleted.");
            setRecentAnalyses(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            toast.error("Failed to delete analysis.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold tracking-tight">Resume Analyzer</h1>
                <p className="text-muted-foreground mt-2">
                    Get detailed, AI-powered feedback on your resume compared to a specific job description.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Input Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Resume Upload */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative bg-background/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 before:absolute before:inset-0 before:rounded-xl before:bg-linear-to-br before:from-white/5 before:to-transparent before:pointer-events-none"
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Upload Resume
                        </h2>
                        {!file ? (
                            <label
                                htmlFor="resume-upload"
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`
                                    block border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
                                    ${isDragging 
                                        ? "border-primary bg-primary/10" 
                                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                                    }
                                `}
                            >
                                <input
                                    type="file"
                                    id="resume-upload"
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                />
                                <div className="flex flex-col items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Upload className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium">
                                            Drag & drop your resume here or{" "}
                                            <span className="text-primary hover:underline">
                                                browse
                                            </span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            PDF up to 10MB
                                        </p>
                                    </div>
                                </div>
                            </label>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile();
                                    }}
                                    className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Job Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative bg-background/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 before:absolute before:inset-0 before:rounded-xl before:bg-linear-to-br before:from-white/5 before:to-transparent before:pointer-events-none"
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-primary" />
                            Job Description
                        </h2>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full h-48 p-4 rounded-lg border border-input bg-background/50 resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="Paste the job description here to get tailored feedback..."
                        />
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        onClick={handleAnalyze}
                        disabled={!file || isAnalyzing}
                        className="w-full py-4 bg-linear-to-r from-yellow-500 to-purple-600 text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Analyzing Resume...
                            </>
                        ) : (
                            <>
                                Analyze Resume
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Sidebar Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                        <h3 className="font-semibold mb-2">How it works</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                                <span className="font-bold text-primary">1.</span>
                                Upload your current resume
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-primary">2.</span>
                                Paste the job description you're applying for
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-primary">3.</span>
                                Get an ATS score and detailed improvement suggestions
                            </li>
                        </ul>
                    </div>

                    <div className="relative bg-background/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 before:absolute before:inset-0 before:rounded-xl before:bg-linear-to-br before:from-white/5 before:to-transparent before:pointer-events-none">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Recent Analyses</h3>
                            <button onClick={loadRecentAnalyses} className="text-muted-foreground hover:text-primary transition-colors">
                                <RefreshCw className="h-4 w-4" />
                            </button>
                        </div>
                        
                        {recentAnalyses.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No recent analyses found.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentAnalyses.map((analysis) => (
                                    <div 
                                        key={analysis.id} 
                                        onClick={() => router.push(`/resume/analyzer/${analysis.id}`)}
                                        className="bg-background/50 border border-border rounded-lg p-3 transition-all hover:border-primary/50 cursor-pointer hover:bg-accent/50 group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{analysis.fileName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(analysis.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {analysis.atsScore && (
                                                    <span className={`text-xs font-bold ${
                                                        analysis.atsScore >= 70 ? 'text-green-500' : 
                                                        analysis.atsScore >= 50 ? 'text-yellow-500' : 'text-red-500'
                                                    }`}>
                                                        {analysis.atsScore}%
                                                    </span>
                                                )}
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteAnalysis(analysis.id);
                                                    }}
                                                    className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-md hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
