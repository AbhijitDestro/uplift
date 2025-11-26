"use client";

import { Card, CardContent } from "@/components/ui/card";

interface CoverLetterPreviewProps {
  content: string;
}

const CoverLetterPreview = ({ content }: CoverLetterPreviewProps) => {
  return (
    <div className="py-4">
      <Card className="backdrop-blur-3xl border-white/10 bg-white/5">
        <CardContent className="p-6">
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
            {content}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverLetterPreview;
