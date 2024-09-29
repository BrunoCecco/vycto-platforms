import { Suspense } from "react";
import Sites from "@/components/edit-sites/sites";
import Link from "next/link";
import PlaceholderCard from "@/components/images/placeholderCard";
import OverviewSitesCTA from "@/components/edit-sites/overviewSitesCTA";
import Loading from "./loading";
import EditCompetitions from "@/components/edit-competition/editCompetitions";

export default function Overview() {
  return (
    <div className="flex flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            Top Playgrounds
          </h1>
          <Suspense fallback={<Loading />}>
            <OverviewSitesCTA />
          </Suspense>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          <Sites limit={4} />
        </Suspense>
      </div>

      <div className="flex flex-col space-y-6">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          <EditCompetitions limit={8} />
        </Suspense>
      </div>
    </div>
  );
}
