import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";

export default async function CoverLetterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  if (!coverLetter) {
    return (
      <div className="container mx-auto py-6">
        <p>Cover letter not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2">
        <Link href="/cover-letter">
          <button className="gap-2 pl-0 text-sm hover:underline flex items-center">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </button>
        </Link>

        <h1 className="text-6xl font-bold gradient-title mb-6">
          {coverLetter.jobTitle} at {coverLetter.companyName}
        </h1>
      </div>

      <CoverLetterPreview content={coverLetter.content} />
    </div>
  );
}