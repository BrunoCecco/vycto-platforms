"use client";

import { useTransition } from "react";
import { createCompetition } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import LoadingDots from "@/components/icons/loadingDots";
import va from "@vercel/analytics";

export default function CreateCompetitionButton() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  console.log(id);
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
        "flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none",
        isPending ? "cursor-not-allowed" : "",
      )}
      disabled={isPending}
    >
      {isPending ? (
        <LoadingDots color="#808080" />
      ) : (
        <div className="h-full w-full rounded-lg shadow-md transition-all hover:shadow-2xl">
          <div className="flex h-48 w-full items-center justify-center rounded-t-lg border border-foreground bg-background">
            <Plus className="h-10 w-10 " />
          </div>
          <h2 className="flex h-32 items-center justify-center p-6 text-lg font-semibold ">
            Create a competition
          </h2>
        </div>
      )}
    </button>
  );
}
