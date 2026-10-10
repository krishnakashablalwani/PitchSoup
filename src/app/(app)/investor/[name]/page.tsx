import { generateInvestorProfile } from "@/app/actions/investorProfile";
import InvestorProfileClient from "./InvestorProfileClient";

export default async function InvestorProfilePage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params;
  const firmName = decodeURIComponent(resolvedParams.name);
  const profileData = await generateInvestorProfile(firmName);

  return (
    <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto py-8">
      <h1 className="font-serif text-2xl font-semibold text-text-primary mb-6">
        Investor Intelligence: {firmName}
      </h1>
      
      {profileData ? (
        <InvestorProfileClient firmName={firmName} profile={profileData} />
      ) : (
        <div className="text-center p-12 bg-bg-floating border border-border-subtle rounded-2xl">
          <p className="text-text-secondary">Failed to load investor profile for {firmName}. Please try again.</p>
        </div>
      )}
    </div>
  );
}
