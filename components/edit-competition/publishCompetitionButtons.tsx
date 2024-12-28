"use client";

import {
  updateCompetitionMetadata,
  updateUserCompetitionStats,
} from "@/lib/actions";
import { SelectCompetition } from "@/lib/schema";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import LoadingDots from "../icons/loadingDots";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import {
  calculateCompetitionPoints,
  validateCorrectAnswers,
} from "@/lib/fetchers";
import Form from "../form";
import { Spinner } from "@nextui-org/react";

export default function PublishCompetitionButtons({
  competition,
}: {
  competition: SelectCompetition & { site: any };
}) {
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();
  const [canPublish, setCanPublish] = useState(true);

  useEffect(() => {
    setCanPublish(
      competition.published ||
        new Date(competition.date.replace(/\[.*\]$/, "")).getTime() >=
          Date.now(),
    );
  }, [competition]);

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
      // assign rewards to users and update the competition stats
      await updateUserCompetitionStats(competition.id);
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

  return canPublish ? (
    <div className="mr-auto flex items-center justify-center gap-4">
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
        isDisabled={isPendingPublishing}
      >
        {isPendingPublishing ? (
          <Spinner />
        ) : (
          <p>{competition.published ? "Unpublish" : "Publish"}</p>
        )}
      </Button>
      {new Date(competition.date.replace(/\[.*\]$/, "")).getTime() <
      Date.now() ? (
        competition.correctAnswersSubmitted ? (
          <Button className="my-2" onClick={submitCorrectAnswers}>
            Update Correct Answers
          </Button>
        ) : (
          <div className="">
            <Button onClick={submitCorrectAnswers}>
              Submit Correct Answers
            </Button>
            {/* <p className="mt-2">
              This competition has ended. Please edit and submit the correct
              answers for each question.
            </p> */}
          </div>
        )
      ) : null}
    </div>
  ) : (
    <div>
      <p className="text-sm ">
        The competition date is invalid - please select a date in the future.
      </p>
    </div>
  );
}
