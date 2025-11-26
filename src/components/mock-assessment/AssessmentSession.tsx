"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { submitAssessment } from '@/app/actions/assessment'
import { Loader2, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

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
            router.push(`/practice-interviews/mock-assessment/${assessment.id}/feedback`)
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
        <div className="container mx-auto py-8 space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">{assessment.topic}</h1>
                    <p className="text-muted-foreground">{assessment.level} Level Assessment</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
                        <Clock className="h-4 w-4" />
                        <span className="font-mono font-semibold">{formatTime(elapsedTime)}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                            {answeredCount} / {assessment.questions.length} answered
                        </span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                        <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">
                            Question {currentQuestion + 1} of {assessment.questions.length}
                        </CardTitle>
                        {userAnswers[currentQuestion] && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-lg leading-relaxed">{question.question}</p>

                    <RadioGroup 
                        value={userAnswers[currentQuestion] || ""} 
                        onValueChange={handleAnswerSelect}
                        className="space-y-3"
                    >
                        {question.options.map((option: string, index: number) => (
                            <div 
                                key={index} 
                                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-muted/50 ${
                                    userAnswers[currentQuestion] === option 
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                                        : 'border-border'
                                }`}
                                onClick={() => handleAnswerSelect(option)}
                            >
                                <RadioGroupItem value={option} id={`option-${index}`} />
                                <Label 
                                    htmlFor={`option-${index}`} 
                                    className="flex-1 cursor-pointer font-medium"
                                >
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Question Navigator */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                        {assessment.questions.map((_: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestion(index)}
                                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                                    currentQuestion === index
                                        ? 'bg-emerald-500 text-white'
                                        : userAnswers[index]
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/70'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="px-6"
                >
                    Previous
                </Button>

                <div className="flex gap-3">
                    {currentQuestion === assessment.questions.length - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
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
                            className="px-6"
                        >
                            Next
                        </Button>
                    )}
                </div>
            </div>

            {/* Warning for unanswered */}
            {answeredCount < assessment.questions.length && (
                <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10">
                    <CardContent className="p-4 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                        <p className="text-sm text-amber-900 dark:text-amber-200">
                            You have {assessment.questions.length - answeredCount} unanswered question(s). 
                            Make sure to answer all questions before submitting.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
