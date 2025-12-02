"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAssessment } from '@/app/actions/assessment'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle, RotateCcw, Trophy, Target, BookOpen, Lightbulb, ArrowLeft, Sparkles } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'

export default function AssessmentFeedbackPage() {
  const params = useParams()
  const router = useRouter()
  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const id = params.id as string

  useEffect(() => {
    if (id) {
      loadAssessment()
    }
  }, [id])

  const loadAssessment = async () => {
    try {
      setLoading(true)
      const data = await getAssessment(id)
      
      if (!data) {
        setError("Assessment not found")
        return
      }
      
      // Check if assessment is completed
      if (data.status !== 'completed') {
        router.push(`/mock-interview/${id}`)
        return
      }
      
      setAssessment(data)
    } catch (err) {
      console.error("Error loading assessment:", err)
      setError("Failed to load assessment")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full p-4 md:p-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto h-full flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Loading your results...</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Analyzing your performance</p>
          </motion.div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full p-4 md:p-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto h-full flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <Card className="border-0 shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
                  <XCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Unable to load results</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
                <Button 
                  onClick={() => router.push('/mock-interview')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  Back to Mock Interviews
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen w-full p-4 md:p-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto h-full flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <Card className="border-0 shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-6">
                  <XCircle className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Results not found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">The assessment results you're looking for don't exist or have been removed.</p>
                <Button 
                  onClick={() => router.push('/mock-interview')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  Back to Mock Interviews
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  const correctCount = assessment.questions.filter((q: any) => q.isCorrect).length
  const totalCount = assessment.questions.length
  const scorePercentage = assessment.quizScore

  // Determine performance level
  let performanceLevel = "Needs Improvement";
  let performanceColor = "text-red-600";
  let performanceBg = "bg-red-100";
  
  if (scorePercentage >= 80) {
    performanceLevel = "Excellent";
    performanceColor = "text-green-600";
    performanceBg = "bg-green-100";
  } else if (scorePercentage >= 60) {
    performanceLevel = "Good";
    performanceColor = "text-blue-600";
    performanceBg = "bg-blue-100";
  } else if (scorePercentage >= 40) {
    performanceLevel = "Fair";
    performanceColor = "text-yellow-600";
    performanceBg = "bg-yellow-100";
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/mock-interview')}
            className="gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessments
          </Button>
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Assessment Results
          </h1>
          <p className="text-xl text-muted-foreground">{assessment.topic} - {assessment.level} Level</p>
        </motion.div>

        {/* Score Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-gray-900 dark:text-white">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-flex flex-col items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 mb-4 mx-auto">
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {scorePercentage?.toFixed(1)}%
                  </span>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${performanceBg} ${performanceColor} dark:${performanceBg.replace('bg-', 'dark:bg-').replace('100', '900/30')} dark:${performanceColor.replace('text-', 'dark:text-')}`}>
                  <Target className="h-5 w-5" />
                  <span className="font-medium">{performanceLevel}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  {correctCount} out of {totalCount} questions correct
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>Progress</span>
                  <span>{scorePercentage?.toFixed(1)}%</span>
                </div>
                <Progress value={scorePercentage} className="h-3 dark:bg-gray-700" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 p-5 rounded-xl text-center dark:bg-green-900/20 dark:border-green-900/50">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3 dark:bg-green-900/30">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">{correctCount}</div>
                  <div className="text-sm text-green-600 font-medium dark:text-green-500">Correct Answers</div>
                </div>
                <div className="bg-red-50 border border-red-200 p-5 rounded-xl text-center dark:bg-red-900/20 dark:border-red-900/50">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3 dark:bg-red-900/30">
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-2xl font-bold text-red-700 dark:text-red-400">{totalCount - correctCount}</div>
                  <div className="text-sm text-red-600 font-medium dark:text-red-500">Incorrect Answers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Improvement Tip */}
        {assessment.improvementTip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-amber-50/50 dark:bg-amber-900/10 backdrop-blur-xl ring-1 ring-amber-500/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-500">
                  <Lightbulb className="h-5 w-5" />
                  Improvement Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-900 dark:text-amber-200">{assessment.improvementTip}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Question Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <BookOpen className="h-5 w-5" />
                Question Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {assessment.questions.map((question: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div 
                    className={`p-5 rounded-xl border ${
                      question.isCorrect 
                        ? 'border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-900/10' 
                        : 'border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        question.isCorrect 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {question.isCorrect ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                      </div>
                      <div className="space-y-4 flex-1">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Question {index + 1}: {question.question}</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Your answer:</p>
                            <div className={`p-3 rounded-lg ${
                              question.isCorrect 
                                ? 'bg-green-100 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400' 
                                : 'bg-red-100 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400'
                            }`}>
                              {question.userAnswer || "No answer provided"}
                            </div>
                          </div>
                          
                          {!question.isCorrect && (
                            <div>
                              <p className="text-sm font-medium text-green-700 mb-2 dark:text-green-500">Correct answer:</p>
                              <div className="p-3 rounded-lg bg-green-100 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400">
                                {question.answer}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            onClick={() => router.push('/mock-interview')}
            variant="outline"
            className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Back to Mock Interviews
          </Button>
          <Button 
            onClick={() => router.push(`/mock-interview/${id}`)}
            className="px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake Assessment
          </Button>
        </motion.div>
      </div>
    </div>
  )
}