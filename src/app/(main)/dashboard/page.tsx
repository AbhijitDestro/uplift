"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    FileText,
    PenTool,
    MessageSquare,
    Video,
    Mic,
    TrendingUp,
    ArrowRight,
    Sparkles,
    Clock,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";

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
        icon: PenTool,
        title: "Resume Builder",
        description: "Create a professional resume",
        href: "/resume-builder",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
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
        title: "Practice Interviews",
        description: "Mock & voice interviews with AI",
        href: "/practice-interviews",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
    {
        icon: TrendingUp,
        title: "Industry Insights",
        description: "Stay ahead with market trends",
        href: "/insights",
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
    },
];

const recentActivity = [
    {
        title: "Resume analyzed",
        description: "Software Engineer Resume.pdf",
        time: "2 hours ago",
        icon: FileText,
    },
    {
        title: "Cover letter generated",
        description: "Google Application",
        time: "1 day ago",
        icon: MessageSquare,
    },
    {
        title: "Mock interview completed",
        description: "Technical Interview Practice",
        time: "2 days ago",
        icon: Video,
    },
];

import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    React.useEffect(() => {
        if (session === null) { // session is null when not authenticated, undefined when loading
            router.push("/sign-in");
        }
    }, [session, router]);

    if (!session) {
        return <div>Loading...</div>; // Or a skeleton loader
    }

    const userName = session.user.name;

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
                    { label: "Resumes Created", value: "12", icon: FileText, color: "text-blue-500" },
                    { label: "Applications", value: "28", icon: CheckCircle2, color: "text-green-500" },
                    { label: "Interviews", value: "8", icon: Video, color: "text-purple-500" },
                    { label: "Hours Practiced", value: "24", icon: Clock, color: "text-orange-500" },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                        className="bg-background/40 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-2xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                ))}
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
                                className="group block bg-background/40 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all"
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
                    className="bg-background/40 backdrop-blur-sm border border-border rounded-xl divide-y divide-border"
                >
                    {recentActivity.map((activity, index) => (
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
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
