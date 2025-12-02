"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
    FileText,
    MessageSquare,
    Video,
    TrendingUp,
    Linkedin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "AI Resume Analyzer",
        description:
            "Get instant feedback on your resume with actionable insights to pass ATS filters.",
        icon: FileText,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },

    {
        title: "Cover Letter Generator",
        description:
            "Generate personalized cover letters that highlight your relevant experience.",
        icon: MessageSquare,
        color: "text-pink-500",
        bg: "bg-pink-500/10",
    },
    {
        title: "Mock Interview",
        description:
            "Practice with AI-driven mock interviews customized for your target role.",
        icon: Video,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
    {
        title: "LinkedIn Optimizer",
        description:
            "Stand out to recruiters with an AI-optimized headline and summary.",
        icon: Linkedin,
        color: "text-blue-600",
        bg: "bg-blue-600/10",
    },

    {
        title: "Industry Insights",
        description:
            "Stay ahead with real-time market trends and salary insights for your field.",
        icon: TrendingUp,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
    },
];

export function Features() {
    return (
        <section id="features" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Everything You Need to Get Hired
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Our AI-powered platform provides a comprehensive suite of tools to
                        help you navigate every step of your job search journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative p-8 bg-background/20 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-md"
                        >
                            <div
                                className={cn(
                                    "inline-flex p-3 rounded-lg mb-5 transition-colors",
                                    feature.bg,
                                    feature.color
                                )}
                            >
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
