"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { authClient } from "@/lib/auth-client"
import { createAssessment, getUserAssessments, deleteAssessment } from "@/app/actions/assessment"
import { Loader2, Trash2, Play, CheckCircle2, Clock, BookOpen, Brain, Target, Sparkles, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

const MockAssessmentPage = () => {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [recentAssessments, setRecentAssessments] = useState<any[]>([])
  const [formData, setFormData] = useState({
    topic: '',
    level: 'Intermediate',
    numberOfQuestions: 10
  })

  useEffect(() => {
    if (session?.user?.id) {
      loadAssessments()
    }
  }, [session?.user?.id])

  const loadAssessments = async () => {
    if (session?.user?.id) {
      const assessments = await getUserAssessments(session.user.id)
      setRecentAssessments(assessments)
    }
  }

  const handleStartAssessment = async () => {
    if (!session?.user?.id) {
        toast.error("Please sign in to start an assessment")
        return
    }
    if (!formData.topic) {
        toast.error("Please enter a topic")
        return
    }

    setIsLoading(true)
    try {
        const assessment = await createAssessment({
            userId: session.user.id,
            ...formData
        })
        router.push(`/mock-interview/${assessment.id}`)
    } catch (error) {
        console.error(error)
        toast.error("Failed to generate assessment")
        setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this assessment?")) {
        await deleteAssessment(id)
        loadAssessments()
        toast.success("Assessment deleted")
    }
  }

  const handleRetake = (assessment: any) => {
    router.push(`/mock-interview/${assessment.id}`)
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-center md:text-left"
        >
          <div className="inline-flex items-center justify-center md:justify-start gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Skill Assessment</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Mock Interview Practice
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Sharpen your skills with AI-generated assessments tailored to your expertise level. Practice and track your progress.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Create Assessment Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5"
          >
            <Card className="h-full border-0 shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-500" />
                  Assessment Details
                </CardTitle>
                <CardDescription>
                  Customize your practice test to match your goals and skill level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="topic" className="text-sm font-medium">Topic / Subject</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="topic" 
                        placeholder="e.g. React.js, Data Structures, System Design" 
                        value={formData.topic}
                        onChange={(e) => setFormData({...formData, topic: e.target.value})}
                        className="pl-9 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level" className="text-sm font-medium">Difficulty Level</Label>
                      <select
                        id="level"
                        value={formData.level}
                        onChange={(e) => setFormData({...formData, level: e.target.value})}
                        className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfQuestions" className="text-sm font-medium">Number of Questions</Label>
                      <Input 
                        id="numberOfQuestions" 
                        type="number"
                        min="5"
                        max="20"
                        value={formData.numberOfQuestions}
                        onChange={(e) => setFormData({...formData, numberOfQuestions: parseInt(e.target.value) || 10})}
                        className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 transform hover:scale-[1.02]" 
                    onClick={handleStartAssessment}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Questions...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Mock Test
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Assessments */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7"
          >
            <Card className="h-full border-0 shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  Recent Assessments
                </CardTitle>
                <CardDescription>
                  Continue your practice or review past assessments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                  {recentAssessments.length === 0 ? (
                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
                      <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                        <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No Assessments Yet</h3>
                      <p className="text-muted-foreground max-w-sm mb-4">
                        Create your first practice test to start tracking your progress.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span>Powered by Advanced AI</span>
                      </div>
                    </div>
                  ) : (
                    recentAssessments.map((assessment) => (
                      <div 
                        key={assessment.id} 
                        className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all cursor-pointer group"
                        onClick={() => assessment.status === 'completed' ? router.push(`/mock-interview/${assessment.id}/feedback`) : handleRetake(assessment)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{assessment.topic}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full">
                                {assessment.level}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {assessment.questions.length} Questions
                              </span>
                              {assessment.status === 'completed' ? (
                                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  {assessment.quizScore?.toFixed(1)}%
                                </span>
                              ) : (
                                <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">
                                  In Progress
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30" 
                              onClick={(e) => handleDelete(assessment.id, e)} 
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-3">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(assessment.createdAt).toLocaleDateString()} • {new Date(assessment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MockAssessmentPage