"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Video, Mic, ArrowRight, Clock, Users, Sparkles } from "lucide-react";
import Link from "next/link";

const interviewTypes = [
    {
        icon: Video,
        title: "Mock Interview",
        description: "Practice with AI-driven mock interviews customized for your target role",
        href: "/practice-interviews/mock",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        features: ["Behavioral Questions", "Technical Questions", "Real-time Feedback"],
    },
    {
        icon: Mic,
        title: "Voice Interview",
        description: "Improve your communication skills with real-time voice feedback and analysis",
        href: "/practice-interviews/voice",
        color: "text-green-500",
        bg: "bg-green-500/10",
        features: ["Speech Analysis", "Tone & Clarity", "Confidence Scoring"],
    },
];

const recentSessions = [
    {
        type: "Mock Interview",
        role: "Software Engineer",
        score: 85,
        date: "2 days ago",
    },
    {
        type: "Voice Interview",
        role: "Product Manager",
        score: 78,
        date: "5 days ago",
    },
];

export default function PracticeInterviewsPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold tracking-tight">Practice Interviews</h1>
                <p className="text-muted-foreground mt-2">
                    Prepare for your next interview with AI-powered practice sessions
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Sessions", value: "24", icon: Video },
                    { label: "Avg Score", value: "82%", icon: Sparkles },
                    { label: "Hours Practiced", value: "12", icon: Clock },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                        className="bg-background/40 backdrop-blur-sm border border-border rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-2xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Interview Types */}
            <div>
                <h2 className="text-2xl font-semibold mb-6">Choose Interview Type</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {interviewTypes.map((type, index) => (
                        <motion.div
                            key={type.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            className="bg-background/40 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`p-3 rounded-lg ${type.bg}`}>
                                    <type.icon className={`h-6 w-6 ${type.color}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {type.description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                {type.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-2 text-sm">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={type.href}
                                className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                            >
                                Start Practice
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Recent Sessions */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Recent Sessions</h2>
                    <Link
                        href="/practice-interviews/history"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                        View all
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-background/40 backdrop-blur-sm border border-border rounded-xl divide-y divide-border"
                >
                    {recentSessions.map((session, index) => (
                        <div
                            key={index}
                            className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <Video className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{session.type}</h4>
                                        <p className="text-sm text-muted-foreground">{session.role}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-semibold text-primary">
                                        {session.score}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">{session.date}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
