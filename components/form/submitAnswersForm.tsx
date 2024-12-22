"use client";

import LoadingDots from "@/components/icons/loadingDots";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { deleteCompetition, submitAnswers } from "@/lib/actions";
import va from "@vercel/analytics";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { usePostHog } from "posthog-js/react";
import { Button, Spinner } from "@nextui-org/react";

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
  const { data: session } = useSession();
  const posthog = usePostHog();

  const handleSubmit = async (formData: FormData) => {
    if (!session && !userId) {
      // If not logged in, redirect to login page
      signIn(undefined, { callbackUrl: `/comp/${slug}` });
      return;
    }

    try {
      const res = await submitAnswers(userId!, competitionId, localAnswers);
      console.log("res", res);
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else {
        posthog?.capture("answers_submitted");
        va.track("Submitted Answers");
        toast.success(`Successfully submitted answers!`);
        // window.location.reload();
      }
    } catch (error) {
      toast.error("An error occurred while submitting answers.");
    }
  };

  return (
    <form action={handleSubmit} className="rounded-lg px-8 pb-8">
      <div className="flex flex-col items-center justify-center gap-4 space-y-2 rounded-lg border border-success-600  p-3">
        <p className="text-center text-sm  ">
          Once submitted, you will not be able to edit your answers.
        </p>
        <FormButton />
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  const [clicked, setClicked] = useState(false);

  return (
    <Button
      className={cn(
        "flex items-center justify-center space-x-2 rounded-full border p-4 text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed "
          : "border-success-600 bg-success-600  bg-transparent hover:text-success-600",
      )}
      isDisabled={pending}
      type="submit"
    >
      {pending ? (
        <Spinner />
      ) : clicked ? (
        <p>Submitted</p>
      ) : (
        <p>Submit Answers</p>
      )}
    </Button>
  );
}
