"use client";

import { useTransition } from "react";
import { createCompetition } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import LoadingDots from "@/components/icons/loading-dots";
import va from "@vercel/analytics";

export default function CreateCompetitionButton() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  console.log(id)
  const [isPending, startTransition] = useTransition();

  if (!id || id === "undefined") {
    return null;
  }

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const competition = await createCompetition(null, id, null);
          va.track("Created Competition");
          router.refresh();
          router.push(`/competition/${competition.id}`);
        })
      }
      className={cn(
        "flex items-center font-medium transition-all focus:outline-none",
        isPending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "active:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:hover:border-blue-500",
      )}
      disabled={isPending}
    >
      {isPending ? (
        <LoadingDots color="#808080" />
      ) : (
        <div className="h-full w-full rounded-lg border border-white shadow-md transition-all hover:shadow-2xl dark:border-stone-700 dark:hover:border-white">
          <div className="flex h-40 w-full items-center justify-center rounded-t-lg border border-white bg-gray-800">
            <Plus className="h-10 w-10 text-white" />
          </div>
          <h2 className="p-6 text-lg font-semibold text-white">
            Create a competition
          </h2>
        </div>
      )}
    </button>
  );
}
