// a bunch of loading divs

import PlaceholderCard from "@/components/media/placeholderCard";

export default function Loading() {
  return (
    <>
      <div className="h-10 w-48 animate-pulse rounded-md bg-background" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <PlaceholderCard key={i} />
        ))}
      </div>
    </>
  );
}
