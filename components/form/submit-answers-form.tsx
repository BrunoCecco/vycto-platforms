"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { deleteCompetition, submitAnswers } from "@/lib/actions";
import va from "@vercel/analytics";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function SubmitAnswersForm({
  userId,
  competitionId,
  slug,
  localAnswers,
}: {
  userId: string | null;
  competitionId: string;
  slug: string;
  localAnswers: { [key: string]: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!session) {
      // If not logged in, redirect to login page
      signIn(undefined, { callbackUrl: `/comp/${slug}` });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitAnswers(userId!, competitionId, localAnswers);
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else {
        va.track("Submitted Answers");
        router.refresh();
        router.push(`/comp/${slug}/${userId}`);
        toast.success(`Successfully submitted answers!`);
      }
    } catch (error) {
      toast.error("An error occurred while submitting answers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-fit rounded-lg bg-white dark:bg-black">
      <div className="flex flex-col items-center justify-center gap-4 space-y-2 rounded-lg border border-green-600 bg-stone-50 p-3 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-center text-sm text-stone-500 dark:text-stone-400">
          Once submitted, you will not be able to edit your answers.
        </p>
        <div className="w-32">
          <FormButton onClick={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}

function FormButton({
  onClick,
  isSubmitting,
}: {
  onClick: () => void;
  isSubmitting: boolean;
}) {
  return (
    <button
      className={cn(
        "flex h-8 w-32 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
        isSubmitting
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-green-600 bg-green-600 text-white hover:bg-white hover:text-green-600 dark:hover:bg-transparent",
      )}
      disabled={isSubmitting}
      onClick={onClick}
    >
      {isSubmitting ? <LoadingDots color="#808080" /> : <p>Submit Answers</p>}
    </button>
  );
}
