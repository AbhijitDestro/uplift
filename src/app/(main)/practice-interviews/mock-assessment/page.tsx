"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { authClient } from "@/lib/auth-client"
import { createAssessment, getUserAssessments, deleteAssessment } from "@/app/actions/assessment"
import { Loader2, Trash2, Play, CheckCircle2, Clock } from 'lucide-react'
import { toast } from 'sonner'

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
        router.push(`/practice-interviews/mock-assessment/${assessment.id}`)
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
    router.push(`/practice-interviews/mock-assessment/${assessment.id}`)
  }

  return (
    <div className="space-y-8 container mx-auto py-6">
        <section className='p-4'>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-primary-foreground w-full p-8 rounded-xl shadow-lg transition-all hover:shadow-xl">
                <div className="space-y-3">
                    <h1 className='text-4xl font-bold tracking-tight'>Master Your Skills with Mock Assessments</h1>
                    <p className="text-lg opacity-90 max-w-2xl">Test your knowledge with AI-generated MCQ assessments. Track your progress and identify areas for improvement.</p>
                </div>
            </div>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
            <section className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Create New Assessment</CardTitle>
                        <CardDescription>Configure your mock test parameters</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="topic" className="text-base">Topic / Subject</Label>
                            <Input 
                                id="topic" 
                                placeholder="e.g. React.js, Data Structures, System Design" 
                                value={formData.topic}
                                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                                className="h-12"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="level" className="text-base">Difficulty Level</Label>
                                <select
                                    id="level"
                                    value={formData.level}
                                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                                    className="w-full h-12 px-3 rounded-md border border-input bg-background"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="numberOfQuestions" className="text-base">Number of Questions</Label>
                                <Input 
                                    id="numberOfQuestions" 
                                    type="number"
                                    min="5"
                                    max="20"
                                    value={formData.numberOfQuestions}
                                    onChange={(e) => setFormData({...formData, numberOfQuestions: parseInt(e.target.value) || 10})}
                                    className="h-12"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button 
                                className="w-full text-lg py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 rounded-xl"
                                onClick={handleStartAssessment}
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Play className="mr-2 h-5 w-5" />}
                                {isLoading ? "Generating Questions..." : "Start Mock Test"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold px-1">Recent Assessments</h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                    {recentAssessments.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                            <p>No assessments found.</p>
                            <p className="text-sm mt-1">Create your first test!</p>
                        </div>
                    ) : (
                        recentAssessments.map((assessment) => (
                            <Card 
                                key={assessment.id} 
                                className="hover:shadow-md transition-shadow cursor-pointer group" 
                                onClick={() => assessment.status === 'completed' ? router.push(`/practice-interviews/mock-assessment/${assessment.id}/feedback`) : handleRetake(assessment)}
                            >
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{assessment.topic}</h3>
                                            <p className="text-sm text-muted-foreground">{assessment.level} Level</p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" 
                                                onClick={(e) => handleDelete(assessment.id, e)} 
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {assessment.questions.length} Questions
                                        </span>
                                        {assessment.status === 'completed' ? (
                                            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                {assessment.quizScore?.toFixed(1)}% Score
                                            </span>
                                        ) : (
                                            <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full">
                                                In Progress
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
                                        {new Date(assessment.createdAt).toLocaleDateString()} • {new Date(assessment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </section>
        </div>
    </div>
  )
}

export default MockAssessmentPage