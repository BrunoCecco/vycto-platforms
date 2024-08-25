"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { deleteCompetition, submitAnswers } from "@/lib/actions";
import va from "@vercel/analytics";

export default function SubmitAnswersForm({
  userId,
  competitionId,
  slug,
}: {
  userId: string;
  competitionId: string;
  slug: string;
}) {
  const router = useRouter();

  return (
    <form
      action={async (data: FormData) =>
        submitAnswers(userId, competitionId).then((res) => {
          if ("error" in res && res.error) {
            toast.error(res.error);
          } else {
            va.track("Submitted Answers");
            router.refresh();
            router.push(`${slug}/${userId}`);
            toast.success(`Successfully submitted answers!`);
          }
        })
      }
      className="mx-auto w-fit rounded-lg bg-white dark:bg-black"
    >
      <div className="flex flex-col  items-center justify-center gap-4 space-y-2 rounded-lg border border-green-600 bg-stone-50 p-3 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-center text-sm text-stone-500 dark:text-stone-400">
          Once submitted, you will not be able to edit your answers.
        </p>
        <div className="w-32">
          <FormButton />
        </div>
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-8 w-32 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-green-600 bg-green-600 text-white hover:bg-white hover:text-green-600 dark:hover:bg-transparent",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Submit Answers</p>}
    </button>
  );
}
