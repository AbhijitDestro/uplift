"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { authClient } from "@/lib/auth-client"
import { createInterview, getUserInterviews, deleteInterview } from "@/app/actions/interview"
import { Loader2, Trash2, RefreshCw, Play } from 'lucide-react'
import { toast } from 'sonner'

const VoiceInterview = () => {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [recentInterviews, setRecentInterviews] = useState<any[]>([])
  const [formData, setFormData] = useState({
    jobRole: '',
    company: '',
    interviewType: '',
    techStack: ''
  })

  useEffect(() => {
    if (session?.user?.id) {
      loadInterviews()
    }
  }, [session?.user?.id])

  const loadInterviews = async () => {
    if (session?.user?.id) {
      const interviews = await getUserInterviews(session.user.id)
      setRecentInterviews(interviews)
    }
  }

  const handleStartInterview = async () => {
    if (!session?.user?.id) {
        toast.error("Please sign in to start an interview")
        return
    }
    if (!formData.jobRole || !formData.interviewType) {
        toast.error("Please fill in the Job Role and Interview Type")
        return
    }

    setIsLoading(true)
    try {
        const interview = await createInterview({
            userId: session.user.id,
            ...formData
        })
        router.push(`/practice-interviews/voice-interview/${interview.id}`)
    } catch (error) {
        console.error(error)
        toast.error("Failed to start interview")
        setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this interview record?")) {
        await deleteInterview(id)
        loadInterviews()
        toast.success("Interview deleted")
    }
  }

  const handleRetake = (interview: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setFormData({
        jobRole: interview.jobRole,
        company: interview.company || '',
        interviewType: interview.interviewType,
        techStack: interview.techStack || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.info("Configuration loaded from previous session")
  }

  return (
    <div className="space-y-8 container mx-auto py-6">
        <section className='p-4'>
            <div className="bg-gradient-to-r from-yellow-500 to-purple-600 text-primary-foreground w-full p-8 rounded-xl flex flex-col md:flex-row justify-between items-center shadow-lg transition-all hover:shadow-xl">
                <div className="space-y-3 mb-4 md:mb-0">
                    <h1 className='text-4xl font-bold tracking-tight'>Get Interview-Ready with AI</h1>
                    <p className="text-lg opacity-90 max-w-xl">Improve your communication skills with real-time voice feedback and analysis. Practice makes perfect.</p>
                </div>
                <div className="shrink-0 relative">
                    <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full transform scale-110"></div>
                    <Image 
                        src="/images/voice-robot-dude.png" 
                        alt="Voice Interview Robot" 
                        width={180} 
                        height={180} 
                        className="object-contain relative z-10 drop-shadow-2xl"
                    />
                </div>
            </div>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
            <section className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Configure New Session</CardTitle>
                        <CardDescription>Tell us about the role you're practicing for</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="jobRole" className="text-base">Job Role</Label>
                                <Input 
                                    id="jobRole" 
                                    placeholder="e.g. Senior Frontend Engineer" 
                                    value={formData.jobRole}
                                    onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-base">Target Company (Optional)</Label>
                                <Input 
                                    id="company" 
                                    placeholder="e.g. Tech Corp" 
                                    value={formData.company}
                                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                                    className="h-12"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="interviewType" className="text-base">Interview Type</Label>
                            <Input 
                                id="interviewType" 
                                placeholder="e.g. Behavioral, System Design, Technical Deep Dive" 
                                value={formData.interviewType}
                                onChange={(e) => setFormData({...formData, interviewType: e.target.value})}
                                className="h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="techStack" className="text-base">Specific Technologies / Knowledge Areas</Label>
                            <Textarea 
                                id="techStack" 
                                placeholder="e.g. React, Next.js, TypeScript, AWS, Microservices..." 
                                className="min-h-[120px] resize-none"
                                value={formData.techStack}
                                onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                            />
                        </div>

                        <div className="pt-4">
                            <Button 
                                className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 rounded-xl"
                                onClick={handleStartInterview}
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Play className="mr-2 h-5 w-5" />}
                                {isLoading ? "Setting up..." : "Start Interview Session"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold px-1">Recent Sessions</h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                    {recentInterviews.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                            <p>No recent interviews found.</p>
                            <p className="text-sm mt-1">Start your first session!</p>
                        </div>
                    ) : (
                        recentInterviews.map((interview) => (
                            <Card key={interview.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => router.push(`/practice-interviews/voice-interview/${interview.id}/feedback`)}>
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg">{interview.jobRole}</h3>
                                            <p className="text-sm text-muted-foreground">{interview.company || "General Practice"}</p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50" onClick={(e) => handleRetake(interview, e)} title="Retake with same settings">
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={(e) => handleDelete(interview.id, e)} title="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">{interview.interviewType}</span>
                                        <span className={`px-2 py-1 rounded-full ${interview.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                            {interview.status === 'completed' ? 'Completed' : 'In Progress'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
                                        {new Date(interview.createdAt).toLocaleDateString()} • {new Date(interview.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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

export default VoiceInterview
