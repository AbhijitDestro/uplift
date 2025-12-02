"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { generateLinkedInContent } from '@/app/actions/linkedin';
import { Loader2, Sparkles, Copy, Check, Linkedin, ArrowRight, UserCircle, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function LinkedInOptimizerPage() {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("");
    const [skills, setSkills] = useState("");
    const [result, setResult] = useState<{ headline: string; summary: string } | null>(null);
    const [copiedHeadline, setCopiedHeadline] = useState(false);
    const [copiedSummary, setCopiedSummary] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!role || !skills) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const content = await generateLinkedInContent({ role, skills });
            setResult(content);
            toast.success("LinkedIn content generated!");
        } catch (error) {
            toast.error("Failed to generate content. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, type: 'headline' | 'summary') => {
        navigator.clipboard.writeText(text);
        if (type === 'headline') {
            setCopiedHeadline(true);
            setTimeout(() => setCopiedHeadline(false), 2000);
        } else {
            setCopiedSummary(true);
            setTimeout(() => setCopiedSummary(false), 2000);
        }
        toast.success("Copied to clipboard");
    };

    return (
        <div className="min-h-screen w-full p-4 md:p-8 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto space-y-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 text-center md:text-left"
                >
                    <div className="inline-flex items-center justify-center md:justify-start gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Profile Enhancement</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        LinkedIn Optimizer
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Stand out to recruiters and grow your network with an AI-optimized headline and professional summary tailored to your goals.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Input Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-5"
                    >
                        <Card className="h-full border-0 shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCircle className="w-5 h-5 text-blue-500" />
                                    Profile Details
                                </CardTitle>
                                <CardDescription>
                                    Enter your professional details to generate optimized content.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleGenerate} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-sm font-medium">Current or Target Role</Label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                id="role" 
                                                placeholder="e.g. Senior Full Stack Developer" 
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="pl-9 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="skills" className="text-sm font-medium">Key Skills & Expertise</Label>
                                        <Textarea 
                                            id="skills" 
                                            placeholder="e.g. React, Node.js, System Design, Team Leadership, Cloud Architecture..." 
                                            value={skills}
                                            onChange={(e) => setSkills(e.target.value)}
                                            className="min-h-[150px] bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                                            required
                                        />
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-[1.02]" 
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Optimizing Profile...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Generate Content
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Results Display */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-7"
                    >
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div 
                                    key="results"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-6"
                                >
                                    {/* Headline Card */}
                                    <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl ring-1 ring-blue-500/20">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                                        <CardHeader className="pb-2 bg-blue-50/50 dark:bg-blue-900/10">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                                    <Linkedin className="w-4 h-4" />
                                                    Optimized Headline
                                                </CardTitle>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(result.headline, 'headline')}
                                                    className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                >
                                                    {copiedHeadline ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <p className="text-lg font-medium leading-relaxed text-gray-900 dark:text-gray-100">
                                                {result.headline}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Summary Card */}
                                    <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl ring-1 ring-purple-500/20">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                                        <CardHeader className="pb-2 bg-purple-50/50 dark:bg-purple-900/10">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                                    <UserCircle className="w-4 h-4" />
                                                    Professional Summary
                                                </CardTitle>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(result.summary, 'summary')}
                                                    className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                                >
                                                    {copiedSummary ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                                                {result.summary}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm"
                                >
                                    <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-6">
                                        <Linkedin className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Ready to Optimize</h3>
                                    <p className="text-muted-foreground max-w-sm mb-6">
                                        Fill in your details on the left to generate a professional LinkedIn profile makeover that attracts recruiters.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                                        <Sparkles className="w-4 h-4 text-yellow-500" />
                                        <span>Powered by Advanced AI</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
