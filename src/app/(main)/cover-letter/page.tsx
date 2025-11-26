import Link from "next/link";
import { Plus } from "lucide-react";
import { getCoverLetters } from "@/actions/cover-letter";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-6xl font-bold gradient-title">Cover Letters</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your AI-generated cover letters
          </p>
        </div>
        <Link href="/cover-letter/new">
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 cursor-pointer">
            <Plus className="h-4 w-4" />
            <span className="hidden lg:block">New Cover Letter</span>
          </button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}
