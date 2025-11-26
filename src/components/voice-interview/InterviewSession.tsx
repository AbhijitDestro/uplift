"use client"

import React, { useEffect, useState, useRef } from 'react'
import Vapi from "@vapi-ai/web"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react'
import { generateFeedback } from '@/app/actions/interview'
import { toast } from 'sonner'

export default function InterviewSession({ interview, userId, userName, userImage }: any) {
    const router = useRouter()
    const [vapi, setVapi] = useState<Vapi | null>(null)
    const [isSessionActive, setIsSessionActive] = useState(false)
    const [isMicOn, setIsMicOn] = useState(true)
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [transcript, setTranscript] = useState<any[]>([])
    const [status, setStatus] = useState("Connecting...")
    const [volumeLevel, setVolumeLevel] = useState(0)

    useEffect(() => {
        // Initialize Vapi
        const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!)
        setVapi(vapiInstance)
        
        vapiInstance.on('call-start', () => {
            setStatus("Interview in Progress")
            setIsSessionActive(true)
        })
        
        vapiInstance.on('call-end', () => {
            handleEndSession()
        })
        
        vapiInstance.on('message', (msg: any) => {
            if (msg.type === 'transcript' && msg.transcriptType === 'final') {
                setTranscript(prev => [...prev, { role: msg.role, content: msg.transcript }])
            }
        })
        
        vapiInstance.on('volume-level', (level) => {
            setVolumeLevel(level)
        })

        vapiInstance.on('error', (e) => {
            console.error("Vapi Error:", e)
            toast.error("Connection error: " + (e.message || "Unknown error"))
        })

        // Start the session
        startVapiSession(vapiInstance)

        return () => {
            vapiInstance.stop()
        }
    }, [])

    const startVapiSession = async (vapiInstance: Vapi) => {
        try {
            if (!process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID) {
                toast.error("Vapi Assistant ID not configured")
                return
            }
            
            await vapiInstance.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID, {
                model: {
                    provider: "openai",
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "system",
                            content: `You are an expert technical interviewer conducting a voice interview for a ${interview.jobRole} position at ${interview.company || "a tech company"}. 
                            The candidate's name is ${userName}.
                            Interview Type: ${interview.interviewType}.
                            Tech Stack: ${interview.techStack}.
                            
                            Your goal is to assess their skills.
                            1. Start by welcoming them and asking "How many questions would you like to answer today?".
                            2. Wait for their number (N).
                            3. Ask exactly N questions, one by one.
                            4. After each answer, provide brief, constructive feedback before moving to the next question.
                            5. After N questions, say "Thank you, that concludes our interview" and end the conversation.
                            
                            Be professional, encouraging, but rigorous.`
                        }
                    ]
                }
            })
        } catch (e: any) {
            console.error("Failed to start Vapi:", e)
            toast.error("Failed to start voice session: " + (e.message || "Unknown error"))
        }
    }

    const handleEndSession = async () => {
        if (status === "Generating Feedback...") return
        setStatus("Generating Feedback...")
        vapi?.stop()
        try {
            // Only generate feedback if we have some transcript
            if (transcript.length > 0) {
                await generateFeedback(interview.id, transcript)
                router.push(`/practice-interviews/voice-interview/${interview.id}/feedback`)
            } else {
                router.push('/practice-interviews/voice-interview')
            }
        } catch (e) {
            console.error(e)
            toast.error("Failed to generate feedback")
            router.push('/practice-interviews/voice-interview')
        }
    }

    const toggleMic = () => {
        if (isMicOn) {
            vapi?.setMuted(true)
        } else {
            vapi?.setMuted(false)
        }
        setIsMicOn(!isMicOn)
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background p-4 md:p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">Mock Interview Session</h1>
                <div className="flex gap-2 items-center">
                    <span className={`inline-flex h-3 w-3 rounded-full ${isSessionActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                    <span className="text-sm font-medium text-muted-foreground mr-4">{status}</span>
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleEndSession}
                    >
                        <PhoneOff className="mr-2 h-4 w-4" />
                        End Session
                    </Button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 h-full">
                {/* Robot Card */}
                <Card className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-muted/50 to-muted border-2 border-primary/10 relative overflow-hidden h-[500px] lg:h-auto">
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                    
                    <div className="relative w-64 h-64 mb-8 animate-float z-10 flex items-center justify-center">
                        <div className={`absolute inset-0 bg-blue-500/20 blur-3xl rounded-full transition-all duration-300 ${volumeLevel > 0.1 ? 'scale-125 opacity-100' : 'scale-100 opacity-50'}`}></div>
                        <div className="text-[180px] leading-none">🤖</div>
                    </div>
                    
                    <div className="text-center space-y-3 z-10 bg-background/80 backdrop-blur-md p-4 rounded-xl border shadow-sm">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">AI Interviewer</h2>
                        <div className="flex items-center justify-center gap-2">
                            {volumeLevel > 0.05 ? (
                                <div className="flex gap-1 h-4 items-end">
                                    <span className="w-1 bg-blue-500 animate-[bounce_1s_infinite] h-2"></span>
                                    <span className="w-1 bg-blue-500 animate-[bounce_1.2s_infinite] h-4"></span>
                                    <span className="w-1 bg-blue-500 animate-[bounce_0.8s_infinite] h-3"></span>
                                </div>
                            ) : (
                                <p className="text-sm font-medium text-muted-foreground">Listening...</p>
                            )}
                        </div>
                    </div>
                </Card>
    
                {/* User Card */}
                <Card className="flex flex-col h-[500px] lg:h-auto overflow-hidden border-2 border-primary/10 shadow-xl bg-card">
                    <div className="flex-1 bg-zinc-900 relative flex items-center justify-center group">
                        {/* User Video/Avatar */}
                        {userImage ? (
                             <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                                <Image src={userImage} alt="User" fill className="object-cover" />
                             </div>
                        ) : (
                            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl ring-4 ring-white/10">
                                <span className="text-5xl font-bold text-white">{userName?.charAt(0) || "U"}</span>
                            </div>
                        )}
                        
                        {/* Controls Overlay */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 p-2 rounded-full backdrop-blur-sm">
                            <Button 
                                variant={isMicOn ? "secondary" : "destructive"} 
                                size="icon" 
                                className="rounded-full"
                                onClick={toggleMic}
                            >
                                {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                            </Button>
                            <Button 
                                variant={isVideoOn ? "secondary" : "destructive"} 
                                size="icon" 
                                className="rounded-full"
                                onClick={() => setIsVideoOn(!isVideoOn)}
                            >
                                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                    
                    {/* Subtitles Section */}
                    <div className="h-1/3 min-h-[200px] bg-background border-t p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 flex flex-col-reverse">
                        <div className="space-y-4">
                            {transcript.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {transcript.length === 0 && (
                                <p className="text-center text-muted-foreground italic mt-4">Conversation will appear here...</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mb-3 border-b pb-2 sticky top-0 bg-background z-10">
                            <div className="h-4 w-1 bg-primary rounded-full"></div>
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live Transcript</h3>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
