"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, FileText, LayoutTemplate, Download, Edit, Trash2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ResumeBuilderPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Resume Builder</h1>
                    <p className="text-muted-foreground mt-2">
                        Create professional, ATS-friendly resumes in minutes.
                    </p>
                </div>

            </motion.div>

            {/* Templates / Start Section */}
            {/* Options Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/resume/builder/create" className="block h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="group cursor-pointer relative overflow-hidden rounded-xl border border-border bg-background/50 hover:border-primary/50 hover:bg-primary/5 transition-all p-8 h-full"
                    >
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Plus className="h-8 w-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Create from Scratch</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    Start with a blank canvas. Choose from our professional templates and build your resume step-by-step.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </Link>

                <Link href="/resume/analyzer" className="block h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="group cursor-pointer relative overflow-hidden rounded-xl border border-border bg-background/50 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all p-8 h-full"
                    >
                        <div className="absolute top-0 right-0 p-3">
                            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-medium border border-purple-500/20">
                                AI Powered
                            </span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Sparkles className="h-8 w-8 text-purple-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold group-hover:text-purple-500 transition-colors">Tailor to Job Description</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    Upload your current resume and a job description. Our AI will optimize your resume to match the role.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            </div>

            {/* My Resumes Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-8"
            >
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    My Resumes
                </h2>
                
                <div className="relative bg-background/30 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none">
                    <div className="p-8 text-center text-muted-foreground relative z-10">
                        <LayoutTemplate className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>You haven't created any resumes yet.</p>
                        <button className="mt-4 text-primary hover:underline text-sm font-medium">
                            Start building your first resume
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
