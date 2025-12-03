"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    FileText,
    MessageSquare,
    Video,
    TrendingUp,
    ArrowRight,
    Sparkles,
    Clock,
    CheckCircle2,
    Linkedin,
    BarChart3,
    Trophy,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getDashboardStats } from "@/app/actions/dashboard";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

const quickActions = [
    {
        icon: FileText,
        title: "Resume Analyzer",
        description: "Get instant feedback on your resume",
        href: "/resume-analyzer",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },

    {
        icon: MessageSquare,
        title: "Cover Letter",
        description: "Generate personalized cover letters",
        href: "/cover-letter",
        color: "text-pink-500",
        bg: "bg-pink-500/10",
    },
    {
        icon: Video,
        title: "Mock Interview",
        description: "Mock interviews with AI",
        href: "/mock-interview",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
    {
        icon: Linkedin,
        title: "LinkedIn Optimizer",
        description: "Optimize your profile",
        href: "/linkedin-optimizer",
        color: "text-blue-600",
        bg: "bg-blue-600/10",
    },
    {
        icon: TrendingUp,
        title: "Industry Insights",
        description: "Stay ahead with market trends",
        href: "/industry-insights",
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
    },
];

export default function DashboardPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const [stats, setStats] = useState({
        resumeAnalyzed: 0,
        coverLettersCreated: 0,
        interviewsTaken: 0,
        averageScore: 0,
        highestScore: 0,
        lastIndustryInsightUpdate: null as Date | null,
    });
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        // More robust session checking
        if (!isPending && session === null) { // session is null when not authenticated, undefined when loading
            router.push("/sign-in");
        }
    }, [session, isPending, router]);

    useEffect(() => {
        const fetchStats = async () => {
            if (session?.user?.id) {
                try {
                    const data = await getDashboardStats();
                    setStats(data);
                } catch (error) {
                    console.error("Failed to fetch dashboard stats:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStats();
    }, [session?.user?.id]);

    if (!session) {
        return <div>Loading...</div>; // Or a skeleton loader
    }

    const userName = session.user.name;

    // Format recent activity based on actual data
    const recentActivity = [];
    
    if (stats.lastIndustryInsightUpdate) {
        recentActivity.push({
            title: "Industry insights updated",
            description: "Latest market trends and salary data",
            time: formatDistanceToNow(new Date(stats.lastIndustryInsightUpdate), { addSuffix: true }),
            icon: TrendingUp,
        });
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
            >
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    Welcome back, {userName}! 👋
                </h1>
                <p className="text-muted-foreground text-lg">
                    Ready to take your career to the next level?
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Resumes Analyzed", value: stats.resumeAnalyzed, icon: FileText, color: "text-blue-500" },
                    { label: "Cover Letters", value: stats.coverLettersCreated, icon: MessageSquare, color: "text-green-500" },
                    { label: "Interviews Taken", value: stats.interviewsTaken, icon: Video, color: "text-purple-500" },
                    { label: "Avg Score", value: `${stats.averageScore}%`, icon: BarChart3, color: "text-orange-500" },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                        className="relative bg-background/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:shadow-2xl transition-all before:absolute before:inset-0 before:rounded-xl before:bg-linear-to-br before:from-white/5 before:to-transparent before:pointer-events-none"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-2xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                ))}
                
                {/* Highest Score Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="relative bg-background/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:shadow-2xl transition-all before:absolute before:inset-0 before:rounded-xl before:bg-linear-to-br before:from-white/5 before:to-transparent before:pointer-events-none"
                >
                    <div className="flex items-center justify-between mb-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold mb-1">{stats.highestScore}%</div>
                    <div className="text-sm text-muted-foreground">Highest Score</div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={action.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                        >
                            <Link
                                href={action.href}
                                className="group block relative bg-background/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-primary/30 hover:shadow-2xl transition-all before:absolute before:inset-0 before:rounded-xl before:bg-linear-to-br before:from-white/5 before:to-transparent before:pointer-events-none"
                            >
                                <div className={`inline-flex p-3 rounded-lg mb-4 ${action.bg}`}>
                                    <action.icon className={`h-6 w-6 ${action.color}`} />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {action.description}
                                </p>
                                <div className="flex items-center text-sm text-primary font-medium">
                                    Get started
                                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Recent Activity</h2>
                    <Link
                        href="/activity"
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
                    className="relative bg-background/30 backdrop-blur-xl border border-white/10 rounded-xl divide-y divide-white/5 before:absolute before:inset-0 before:rounded-xl before:bg-linear-to-br before:from-white/5 before:to-transparent before:pointer-events-none"
                >
                    {recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                                        <activity.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium mb-1">{activity.title}</h4>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {activity.description}
                                        </p>
                                    </div>
                                    <div className="text-xs text-muted-foreground shrink-0">
                                        {activity.time}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center">
                            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium mb-1">No recent activity</h3>
                            <p className="text-sm text-muted-foreground">
                                Your industry insights will appear here when updated
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}