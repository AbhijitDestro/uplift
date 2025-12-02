"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAssessment } from '@/app/actions/assessment'
import AssessmentSession from '@/components/mock-assessment/AssessmentSession'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AssessmentPage() {
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
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Loading your assessment...</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Preparing your questions</p>
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
                  <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Unable to load assessment</h3>
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
                  <AlertTriangle className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Assessment not found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">The assessment you're looking for doesn't exist or has been removed.</p>
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

  return (
    <div className="min-h-screen w-full p-4 md:p-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/mock-interview')}
            className="gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessments
          </Button>
        </div>
        
        <AssessmentSession assessment={assessment} />
      </div>
    </div>
  )
}