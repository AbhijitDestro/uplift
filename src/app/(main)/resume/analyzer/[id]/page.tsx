"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, AlertCircle, TrendingUp, Award, Target, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getResume } from "@/app/actions/resume";

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

export default function ResumeAnalysisResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [resumeData, setResumeData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchResume = async () => {
            try {
                const data = await getResume(id);
                if (!data) {
                    notFound();
                }
                setResumeData(data);
            } catch (error) {
                console.error("Failed to fetch resume", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResume();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                    <div className="absolute inset-0 rounded-full h-16 w-16 border-t-2 border-b-2 border-primary/30 animate-ping"></div>
                </div>
            </div>
        );
    }

    if (!resumeData) return null;

    const analysis = resumeData.analysis as AnalysisResult;

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'from-green-500 to-emerald-600';
        if (score >= 50) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-rose-600';
    };

    const getScoreGradient = (score: number) => {
        if (score >= 70) return 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20';
        if (score >= 50) return 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20';
        return 'bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-500/20';
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <Link 
                    href="/resume/analyzer"
                    className="p-2 hover:bg-accent rounded-full transition-all hover:scale-110"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Analysis Results
                    </h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        {resumeData.fileName} • {new Date(resumeData.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Overall Score Card - Enhanced */}
                    <div className={`relative overflow-hidden rounded-2xl p-8 border ${getScoreGradient(analysis.overallScore)}`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl"></div>
                        
                        <div className="flex items-center gap-8 relative z-10">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="relative h-40 w-40 flex items-center justify-center"
                            >
                                <svg className="h-full w-full transform -rotate-90">
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="10"
                                        fill="transparent"
                                        className="text-muted/10"
                                    />
                                    <motion.circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="url(#scoreGradient)"
                                        strokeWidth="10"
                                        fill="transparent"
                                        strokeDasharray={440}
                                        initial={{ strokeDashoffset: 440 }}
                                        animate={{ strokeDashoffset: 440 - (440 * analysis.overallScore) / 100 }}
                                        transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                                        strokeLinecap="round"
                                    />
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" className={analysis.overallScore >= 70 ? 'text-green-500' : analysis.overallScore >= 50 ? 'text-yellow-500' : 'text-red-500'} stopColor="currentColor" />
                                            <stop offset="100%" className={analysis.overallScore >= 70 ? 'text-emerald-600' : analysis.overallScore >= 50 ? 'text-orange-500' : 'text-rose-600'} stopColor="currentColor" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.span 
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="text-5xl font-bold bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent"
                                    >
                                        {analysis.overallScore}
                                    </motion.span>
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Score</span>
                                </div>
                            </motion.div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Award className="h-6 w-6 text-primary" />
                                    <h2 className="text-3xl font-bold">Overall Performance</h2>
                                </div>
                                <p className="text-muted-foreground text-lg">
                                    {analysis.overallScore >= 70 ? "🎉 Excellent! Your resume is well-optimized." :
                                     analysis.overallScore >= 50 ? "👍 Good start, but there's room for improvement." :
                                     "💪 Your resume needs attention. Let's improve it!"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Breakdown - Enhanced */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: "ATS Compatibility", value: analysis.atsScore, icon: Target, color: "blue" },
                            { label: "Education", value: analysis.educationScore, icon: Award, color: "purple" },
                            { label: "Experience", value: analysis.experienceScore, icon: TrendingUp, color: "orange" },
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="group relative overflow-hidden bg-background/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-2 rounded-lg bg-${item.color}-500/10`}>
                                            <item.icon className={`h-5 w-5 text-${item.color}-500`} />
                                        </div>
                                        <span className={`text-2xl font-bold bg-gradient-to-r ${getScoreColor(item.value)} bg-clip-text text-transparent`}>
                                            {item.value}%
                                        </span>
                                    </div>
                                    <p className="font-semibold text-sm">{item.label}</p>
                                    <div className="mt-3 h-2 bg-muted/30 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.value}%` }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                            className={`h-full bg-gradient-to-r ${getScoreColor(item.value)} rounded-full`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Feedback Section - Enhanced */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative bg-background/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-8 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="h-5 w-5 text-primary" />
                                <h3 className="text-xl font-bold">Executive Summary</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-base">
                                {analysis.detailedFeedback}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 rounded-lg bg-green-500/10">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-green-500">Strengths</h3>
                                </div>
                                <ul className="space-y-3">
                                    {analysis.strengths.map((strength, i) => (
                                        <motion.li 
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + i * 0.1 }}
                                            className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10 hover:border-green-500/30 transition-colors"
                                        >
                                            <Zap className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            <span className="text-sm">{strength}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 rounded-lg bg-orange-500/10">
                                        <AlertCircle className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-orange-500">Areas for Improvement</h3>
                                </div>
                                <ul className="space-y-3">
                                    {analysis.improvements.map((improvement, i) => (
                                        <motion.li 
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + i * 0.1 }}
                                            className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 hover:border-orange-500/30 transition-colors"
                                        >
                                            <Target className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                                            <span className="text-sm">{improvement}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Sidebar - Enhanced */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* Keywords Analysis - Enhanced */}
                    <div className="relative bg-background/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"></div>
                        
                        <div className="relative z-10">
                            <h3 className="font-bold mb-6 text-lg flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Keyword Analysis
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-green-500">Matching Keywords</span>
                                        <span className="text-xs bg-green-500/20 text-green-500 px-3 py-1 rounded-full font-bold">
                                            {analysis.matchingKeywords.length} found
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.matchingKeywords.map((keyword, i) => (
                                            <motion.span 
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.7 + i * 0.05 }}
                                                className="px-3 py-1.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-500 text-xs rounded-lg border border-green-500/30 font-medium hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20 transition-all cursor-default"
                                            >
                                                {keyword}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-red-500">Missing Keywords</span>
                                        <span className="text-xs bg-red-500/20 text-red-500 px-3 py-1 rounded-full font-bold">
                                            {analysis.missingKeywords.length} missing
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.missingKeywords.map((keyword, i) => (
                                            <motion.span 
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.7 + i * 0.05 }}
                                                className="px-3 py-1.5 bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-500 text-xs rounded-lg border border-red-500/30 font-medium hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transition-all cursor-default"
                                            >
                                                {keyword}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Description Preview - Enhanced */}
                    {resumeData.jobDescription && (
                        <div className="relative bg-background/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl"></div>
                            
                            <div className="relative z-10">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Target className="h-5 w-5 text-primary" />
                                    Job Description
                                </h3>
                                <div className="text-sm text-muted-foreground max-h-60 overflow-y-auto pr-2 custom-scrollbar leading-relaxed">
                                    {resumeData.jobDescription}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
