import { getAllCompetitions } from "@/lib/fetchers";
import Image from "next/image";

export default async function HomePage() {
  const allComps = await getAllCompetitions();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-100 to-purple-200 lg:flex-row">
      {/* Left side - Logo/Title */}
      <div className="mx-auto flex items-center justify-center p-8 lg:w-1/2 lg:p-16">
        <Image src="/logo.png" alt="VYCTO" width={100} height={100} />
      </div>

      {/* Right side - Scrollable Cards
      <div className="max-h-screen overflow-y-auto p-8 lg:w-1/2">
        <h1 className="mb-12 text-xl font-bold">Top Competitions</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {allComps
            .filter((comp) => new Date(comp.date).getTime() >= Date.now())
            .map((comp) => (
              <CompetitionCard
                key={comp.id}
                siteData={comp.site!}
                competition={comp}
              />
            ))}
        </div>
      </div> */}
    </div>
  );
}
