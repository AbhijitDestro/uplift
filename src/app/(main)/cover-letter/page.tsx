"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Wand2, FileText, Briefcase, Copy, Download, RefreshCw } from "lucide-react";

export default function CoverLetterPage() {
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [generatedContent, setGeneratedContent] = React.useState("");

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate generation
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedContent("Dear Hiring Manager,\n\nI am writing to express my strong interest in the Software Engineer position...");
        }, 2000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold tracking-tight">AI Cover Letter Generator</h1>
                <p className="text-muted-foreground mt-2">
                    Generate personalized, compelling cover letters in seconds using AI.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-6"
                >
                    <div className="bg-background/40 backdrop-blur-sm border border-border rounded-xl p-6 space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            Job Details
                        </h2>
                        
                        <div>
                            <label className="text-sm font-medium mb-2 block">Job Title</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Senior Frontend Developer"
                                className="w-full h-10 px-3 rounded-lg border border-input bg-background/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Company Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Tech Corp Inc."
                                className="w-full h-10 px-3 rounded-lg border border-input bg-background/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Job Description</label>
                            <textarea 
                                className="w-full h-32 p-3 rounded-lg border border-input bg-background/50 text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="Paste the job description here..."
                            />
                        </div>
                    </div>

                    <div className="bg-background/40 backdrop-blur-sm border border-border rounded-xl p-6 space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Your Experience
                        </h2>
                        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer">
                            <p className="text-sm text-muted-foreground">
                                Select a resume from your builder or upload a new one
                            </p>
                            <button className="mt-2 text-primary font-medium text-sm">
                                Choose Resume
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full py-4 bg-linear-to-r from-primary to-purple-600 text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="h-5 w-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Wand2 className="h-5 w-5" />
                                Generate Cover Letter
                            </>
                        )}
                    </button>
                </motion.div>

                {/* Output Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-background/40 backdrop-blur-sm border border-border rounded-xl p-6 flex flex-col h-full min-h-[500px]"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Generated Letter</h2>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Copy">
                                <Copy className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Download">
                                <Download className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 bg-background/50 rounded-xl border border-border p-6 font-serif text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto">
                        {generatedContent ? (
                            generatedContent
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                <Wand2 className="h-12 w-12 mb-4" />
                                <p>Fill in the details and click generate to see the magic happen.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
