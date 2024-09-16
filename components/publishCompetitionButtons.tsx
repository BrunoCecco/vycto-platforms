"use client";

import { updateCompetitionMetadata } from "@/lib/actions";
import { SelectCompetition } from "@/lib/schema";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import LoadingDots from "./icons/loading-dots";
import { cn } from "@/lib/utils";
import Button from "./button";
import {
  calculateCompetitionPoints,
  validateCorrectAnswers,
} from "@/lib/fetchers";
import Form from "./form";

export default function PublishCompetitionButtons({
  competition,
}: {
  competition: SelectCompetition & { site: any };
}) {
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();

  const submitCorrectAnswers = async () => {
    if (!(new Date(competition.date).getTime() < Date.now())) {
      toast.error("Competition has not ended yet.");
      return;
    }
    // calculate points
    try {
      await validateCorrectAnswers(competition.id);
      // now we can calculate the points
      await calculateCompetitionPoints(competition.id);
      const formData = new FormData();
      formData.append("correctAnswersSubmitted", "true");
      await updateCompetitionMetadata(
        formData,
        competition.id,
        "correctAnswersSubmitted",
      );
      toast.success("Successfully calculated points for the competition.");
      return;
    } catch (e: any) {
      console.error(e);
      toast.error(e.message);
      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Button
        onClick={() => {
          const formData = new FormData();
          formData.append("published", String(!competition.published));
          startTransitionPublishing(async () => {
            await updateCompetitionMetadata(
              formData,
              competition.id,
              "published",
            ).then(() => {
              toast.success(
                `Successfully ${
                  competition.published ? "unpublished" : "published"
                } your competition.`,
              );
            });
          });
        }}
        className={cn(
          "flex items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none",
          isPendingPublishing
            ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
            : "border border-black bg-black text-white hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
        )}
        disabled={isPendingPublishing}
      >
        {isPendingPublishing ? (
          <LoadingDots />
        ) : (
          <p>{competition.published ? "Unpublish" : "Publish"}</p>
        )}
      </Button>
      {new Date(competition.date).getTime() < Date.now() ? (
        competition.correctAnswersSubmitted ? (
          <Button className="my-2" onClick={submitCorrectAnswers}>
            Update Correct Answers
          </Button>
        ) : (
          <>
            <div className="my-2">
              <p>
                This competition has ended. Please edit and submit the correct
                answers for each question.
              </p>
            </div>
            <Button onClick={submitCorrectAnswers}>
              Submit Correct Answers
            </Button>
          </>
        )
      ) : null}
    </div>
  );
}
