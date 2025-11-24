"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Upload, FileText, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ResumeAnalyzerPage() {
    const [isDragging, setIsDragging] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);

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
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Resume Upload */}
                    <div className="bg-background/40 backdrop-blur-sm border border-border rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Upload Resume
                        </h2>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`
                                border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
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
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                            />
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Upload className="h-6 w-6 text-primary" />
                                </div>
                                {file ? (
                                    <div className="flex items-center gap-2 text-green-500 font-medium">
                                        <CheckCircle2 className="h-5 w-5" />
                                        {file.name}
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <p className="font-medium">
                                            Drag & drop your resume here or{" "}
                                            <label htmlFor="resume-upload" className="text-primary hover:underline cursor-pointer">
                                                browse
                                            </label>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            PDF, DOCX up to 10MB
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="bg-background/40 backdrop-blur-sm border border-border rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-primary" />
                            Job Description
                        </h2>
                        <textarea
                            className="w-full h-48 p-4 rounded-lg border border-input bg-background/50 resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="Paste the job description here to get tailored feedback..."
                        />
                    </div>

                    <button className="w-full py-4 bg-linear-to-r from-primary to-purple-600 text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        Analyze Resume
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </motion.div>

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

                    <div className="bg-background/40 backdrop-blur-sm border border-border rounded-xl p-6">
                        <h3 className="font-semibold mb-4">Recent Analyses</h3>
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No recent analyses found.
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
