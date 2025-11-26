import { getIndustryInsights } from "@/actions/industry-insights";
import IndustryView from "./_component/IndustryView";
import Link from "next/link";

export default async function IndustryInsightsPage() {
  const insights = await getIndustryInsights();

  if (!insights) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
        <h2 className="text-2xl font-bold">Industry Insights</h2>
        <p className="text-muted-foreground max-w-md">
          We need your industry information to generate personalized insights. Please complete your profile to continue.
        </p>
        <Link
          href="/onboarding"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Complete Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <IndustryView insights={insights} />
    </div>
  );
}