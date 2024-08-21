"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createQuestion,
  updateCompetition,
  updateCompetitionMetadata,
} from "@/lib/actions";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import LoadingDots from "../icons/loading-dots";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { SelectCompetition, SelectQuestion } from "@/lib/schema";
import QuestionBuilder from "../questionBuilder";

type CompetitionWithSite = SelectCompetition & {
  site: { subdomain: string | null } | null;
};

export default function Editor({
  competition,
  initialQuestions,
}: {
  competition: CompetitionWithSite;
  initialQuestions: SelectQuestion[];
}) {
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();
  const [data, setData] = useState<CompetitionWithSite>(competition);

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`
    : `http://${data.site?.subdomain}.localhost:3000/${data.slug}`;

  // listen to CMD + S and override the default behavior
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "s") {
        e.preventDefault();
        startTransitionSaving(async () => {
          await updateCompetition(data);
        });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [data, startTransitionSaving]);

  return (
    <div className="max-w-screen relative min-h-[500px] w-full border-stone-200 p-12 px-8 pt-24 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:pt-12 sm:shadow-lg dark:border-stone-700">
      <div className="absolute right-5 top-16 mb-5 flex items-center space-x-3 sm:right-5 sm:top-5">
        {data.published && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-stone-400 hover:text-stone-500"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <button
          className="rounded-lg bg-stone-400 px-2 py-1 text-sm text-white hover:opacity-75 dark:bg-stone-800 dark:text-stone-500"
          onClick={() => {
            startTransitionSaving(async () => {
              await updateCompetition(data);
            });
          }}
        >
          {isPendingSaving ? "Saving..." : "Save (CTRL + S)"}
        </button>
        <button
          onClick={() => {
            const formData = new FormData();
            formData.append("published", String(!data.published));
            startTransitionPublishing(async () => {
              await updateCompetitionMetadata(
                formData,
                competition.id,
                "published",
              ).then(() => {
                toast.success(
                  `Successfully ${
                    data.published ? "unpublished" : "published"
                  } your competition.`,
                );
                setData((prev) => ({ ...prev, published: !prev.published }));
              });
            });
          }}
          className={cn(
            "flex h-7 w-24 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none",
            isPendingPublishing
              ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              : "border border-black bg-black text-white hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
          )}
          disabled={isPendingPublishing}
        >
          {isPendingPublishing ? (
            <LoadingDots />
          ) : (
            <p>{data.published ? "Unpublish" : "Publish"}</p>
          )}
        </button>
      </div>
      <div className="mb-5 flex flex-col space-y-3 border-b border-stone-200 pb-5 dark:border-stone-700">
        <input
          type="text"
          placeholder="Title"
          defaultValue={competition?.title || ""}
          autoFocus
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="dark:placeholder-text-600 border-none px-0 font-cal text-3xl placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
        />
        <TextareaAutosize
          placeholder="Description"
          defaultValue={competition?.description || ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
        />
      </div>
      <QuestionBuilder
        competitionId={competition.id}
        initialQuestions={initialQuestions}
      />
    </div>
  );
}
