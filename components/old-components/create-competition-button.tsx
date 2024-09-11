"use client";

import { useTransition } from "react";
import { createCompetition } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import LoadingDots from "@/components/icons/loading-dots";
import va from "@vercel/analytics";

export default function CreateCompetitionButton() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [isPending, startTransition] = useTransition();

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
        "flex items-center space-x-2 rounded-lg p-2 px-4 text-lg font-medium transition-all focus:outline-none",
        isPending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "text-black hover:border-blue-500 hover:bg-stone-100 active:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:hover:border-blue-500",
      )}
      disabled={isPending}
    >
      {isPending ? (
        <LoadingDots color="#808080" />
      ) : (
        <>
          {/* Plus icon using Lucide-react */}
          <PlusCircle className="h-6 w-6 text-indigo-700" />
          <span>Create a competition</span>
        </>
      )}
    </button>
  );
}
