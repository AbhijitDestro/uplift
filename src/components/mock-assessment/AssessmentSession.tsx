"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { submitAssessment } from '@/app/actions/assessment'
import { Loader2, CheckCircle, Clock, AlertCircle, Target, BookOpen, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function AssessmentSession({ assessment }: any) {
    const router = useRouter()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [startTime] = useState(Date.now())
    const [elapsedTime, setElapsedTime] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
        }, 1000)
        return () => clearInterval(timer)
    }, [startTime])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleAnswerSelect = (answer: string) => {
        setUserAnswers({ ...userAnswers, [currentQuestion]: answer })
    }

    const handleNext = () => {
        if (currentQuestion < assessment.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        }
    }

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
        }
    }

    const handleSubmit = async () => {
        const unanswered = assessment.questions.length - Object.keys(userAnswers).length
        if (unanswered > 0) {
            if (!confirm(`You have ${unanswered} unanswered question(s). Do you want to submit anyway?`)) {
                return
            }
        }

        setIsSubmitting(true)
        try {
            await submitAssessment(assessment.id, userAnswers)
            toast.success("Assessment submitted successfully!")
            router.push(`/mock-interview/${assessment.id}/feedback`)
        } catch (error) {
            console.error(error)
            toast.error("Failed to submit assessment")
            setIsSubmitting(false)
        }
    }

    const question = assessment.questions[currentQuestion]
    const answeredCount = Object.keys(userAnswers).length
    const progress = (answeredCount / assessment.questions.length) * 100

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <Card className="border-0 shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{assessment.topic}</h1>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-indigo-900/30 dark:text-indigo-200">
                                    {assessment.level} Level
                                </span>
                                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-gray-700 dark:text-gray-200">
                                    {assessment.questions.length} Questions
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg dark:bg-indigo-900/30">
                                <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                <span className="font-mono font-semibold text-indigo-700 dark:text-indigo-300">{formatTime(elapsedTime)}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {answeredCount} / {assessment.questions.length} answered
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden dark:bg-gray-700">
                            <div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-300" 
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="border-0 shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                                <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                Question {currentQuestion + 1} of {assessment.questions.length}
                            </CardTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose the best answer</p>
                        </div>
                        {userAnswers[currentQuestion] && (
                            <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full dark:bg-green-900/30 dark:text-green-400">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Answered</span>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <div className="prose prose-indigo max-w-none dark:prose-invert">
                        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">{question.question}</p>
                    </div>

                    <RadioGroup 
                        value={userAnswers[currentQuestion] || ""} 
                        onValueChange={handleAnswerSelect}
                        className="space-y-3"
                    >
                        {question.options.map((option: string, index: number) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div 
                                    className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                                        userAnswers[currentQuestion] === option 
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-500' 
                                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/50'
                                    }`}
                                    onClick={() => handleAnswerSelect(option)}
                                >
                                    <RadioGroupItem 
                                        value={option} 
                                        id={`option-${index}`} 
                                        className="h-5 w-5 border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:text-indigo-400"
                                    />
                                    <Label 
                                        htmlFor={`option-${index}`} 
                                        className="flex-1 cursor-pointer text-gray-800 font-medium dark:text-gray-200"
                                    >
                                        {option}
                                    </Label>
                                </div>
                            </motion.div>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Question Navigator */}
            <Card className="border-0 shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                        {assessment.questions.map((_: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestion(index)}
                                className={`w-10 h-10 rounded-lg font-semibold transition-all flex items-center justify-center ${
                                    currentQuestion === index
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : userAnswers[index]
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    Previous
                </Button>

                <div className="flex gap-3">
                    {currentQuestion === assessment.questions.length - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Submit Test
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        >
                            Next
                        </Button>
                    )}
                </div>
            </div>

            {/* Warning for unanswered */}
            {answeredCount < assessment.questions.length && (
                <Card className="border-0 shadow-xl bg-amber-50/50 dark:bg-amber-900/10 backdrop-blur-xl ring-1 ring-amber-500/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0" />
                        <p className="text-sm text-amber-900 dark:text-amber-200">
                            You have {assessment.questions.length - answeredCount} unanswered question(s). 
                            Make sure to answer all questions before submitting.
                        </p>
                    </CardContent>
                </Card>
            )}
        </motion.div>
    )
}