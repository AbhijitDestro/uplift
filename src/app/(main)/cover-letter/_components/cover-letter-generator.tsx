"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter } from "@/actions/cover-letter";
import { coverLetterSchema, type CoverLetterFormData } from "@/lib/schemas";

export default function CoverLetterGenerator() {
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CoverLetterFormData>({
    resolver: zodResolver(coverLetterSchema),
  });

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const onSubmit = async (data: CoverLetterFormData) => {
    setGenerating(true);
    try {
      const generatedLetter = await generateCoverLetter(data);
      setGeneratedContent(generatedLetter.content);
      toast.success("Cover letter generated successfully!");
      // We don't reset the form so the user can tweak inputs if needed
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate cover letter");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column: Input Form */}
      <div className="space-y-6">
        <Card className="backdrop-blur-3xl border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Provide information about the position you're applying for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    {...register("companyName")}
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="Enter job title"
                    {...register("jobTitle")}
                  />
                  {errors.jobTitle && (
                    <p className="text-sm text-red-500">
                      {errors.jobTitle.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the job description here"
                  className="h-32"
                  {...register("jobDescription")}
                />
                {errors.jobDescription && (
                  <p className="text-sm text-red-500">
                    {errors.jobDescription.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={generating}>
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Cover Letter"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Generated Output */}
      <div className="space-y-6">
        <Card className="h-full flex flex-col backdrop-blur-3xl border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Generated Letter</CardTitle>
              <CardDescription>
                Your AI-generated cover letter will appear here
              </CardDescription>
            </div>
            {generatedContent && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[calc(100vh-200px)]">
            {generatedContent ? (
              <div className="prose dark:prose-invert max-w-none p-4 rounded-lg bg-white/5 border border-white/10 whitespace-pre-wrap">
                {generatedContent}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground p-8">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
                <p className="text-lg font-medium">Ready to generate</p>
                <p className="text-sm">
                  Fill out the form and click generate to create your cover letter
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}