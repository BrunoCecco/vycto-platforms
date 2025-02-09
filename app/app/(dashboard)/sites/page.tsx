import { Suspense } from "react";
import Sites from "@/components/edit-sites/sites";
import PlaceholderCard from "@/components/media/placeholderCard";
import CreateSiteButton from "@/components/edit-fanzone/createSiteButton";
import CreateSiteModal from "@/components/modal/createSite";

export default function AllSites({ params }: { params: { id: string } }) {
  return (
    <div className="flex  flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h1 className="text-3xl font-bold ">All Playgrounds</h1>
          <CreateSiteButton>
            <CreateSiteModal />
          </CreateSiteButton>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          {/* @ts-expect-error Server Component */}
          <Sites siteId={decodeURIComponent(params.id)} />
        </Suspense>
      </div>
    </div>
  );
}
