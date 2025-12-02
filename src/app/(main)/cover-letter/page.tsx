"use client";

import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { getCoverLetters } from "@/actions/cover-letter";
import CoverLetterList from "./_components/cover-letter-list";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CoverLetterPage() {
  const [coverLetters, setCoverLetters] = useState<any[]>([]);

  useEffect(() => {
    const fetchCoverLetters = async () => {
      try {
        const data = await getCoverLetters();
        setCoverLetters(data);
      } catch (error) {
        console.error("Failed to fetch cover letters:", error);
      }
    };

    fetchCoverLetters();
  }, []);

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
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Document Creation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Cover Letters
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Create and manage your AI-generated cover letters tailored to each job application.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Your Cover Letters</h2>
              <p className="text-muted-foreground">
                Manage and review your generated cover letters
              </p>
            </div>
            <Link href="/cover-letter/new">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-[1.02]">
                <Plus className="h-4 w-4 mr-2" />
                <span>New Cover Letter</span>
              </Button>
            </Link>
          </div>

          <CoverLetterList coverLetters={coverLetters} />
        </motion.div>
      </div>
    </div>
  );
}