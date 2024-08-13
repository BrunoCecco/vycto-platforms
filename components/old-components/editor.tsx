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
import type { SelectCompetition } from "@/lib/schema";
import { QuestionType } from "@/lib/types";

type CompetitionWithSite = SelectCompetition & {
  site: { subdomain: string | null } | null;
};

export default function Editor({
  competition,
}: {
  competition: CompetitionWithSite;
}) {
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();
  const [questions, setQuestions] = useState<any[]>([]);
  const [data, setData] = useState<CompetitionWithSite>(competition);
  const [hydrated, setHydrated] = useState(false);

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

  const createQuestions = async () => {
    try {
      // promise all the questions
      await Promise.all(
        questions.map(async (question) => {
          var formData = new FormData();
          formData.append("competitionId", data.id);
          formData.append("question", question.question);
          formData.append("type", question.type);
          formData.append("answer1", question.answer1);
          formData.append("answer2", question.answer2);
          formData.append("points", question.points);
          if (question.correctAnswer) {
            formData.append("correctAnswer", question.correctAnswer);
          }
          await createQuestion(formData);
        }),
      );
      toast.success("Successfully saved questions.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save questions.");
    }
  };

  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg dark:border-stone-700">
      <div className="absolute right-5 top-5 mb-5 flex items-center space-x-3">
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
        <div className="rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400 dark:bg-stone-800 dark:text-stone-500">
          {isPendingSaving ? "Saving..." : "Saved"}
        </div>
        <button
          className="rounded-lg bg-stone-400 px-2 py-1 text-sm text-white hover:opacity-75 dark:bg-stone-800 dark:text-stone-500"
          onClick={() => {
            startTransitionSaving(async () => {
              await updateCompetition(data);
            });
          }}
        >
          Save (Ctrl + S)
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
      {/* Select type of question using QuestionType enum*/}
      <select
        className="w-full rounded-lg border border-stone-200 p-2 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-500"
        onChange={(e) => {
          // get question type integer value
          const selectedType = e.target.value as QuestionType;
          setQuestions((prev: any) => [
            ...prev,
            {
              competitionId: data.id,
              type: selectedType,
              answer1: "true",
              answer2: "false",
              points: 5,
            },
          ]);
        }}
      >
        <option value={QuestionType.TrueFalse}>True or False</option>
        <option value={QuestionType.WhatMinute}>What Minute</option>
        <option value={QuestionType.MatchOutcome}>Match Outcome</option>
        <option value={QuestionType.GuessScore}>Guess Score</option>
        <option value={QuestionType.PlayerGoals}>Player Goals</option>
        <option value={QuestionType.PlayerSelection}>Player Selection</option>
      </select>
      <div className="mt-8 flex flex-col space-y-3">
        {questions.map((question, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="text-stone-400 dark:text-stone-500">
                {question.type === QuestionType.TrueFalse && "True or False"}
                {question.type === QuestionType.WhatMinute && "What Minute"}
                {question.type === QuestionType.MatchOutcome && "Match Outcome"}
                {question.type === QuestionType.GuessScore && "Guess Score"}
                {question.type === QuestionType.PlayerGoals && "Player Goals"}
                {question.type === QuestionType.PlayerSelection &&
                  "Player Selection"}
              </div>
              <button
                className="rounded-lg bg-stone-400 px-2 py-1 text-sm text-white hover:opacity-75 dark:bg-stone-800 dark:text-stone-500"
                onClick={() => {
                  setQuestions((prev) => {
                    const updatedQuestions = [...prev];
                    updatedQuestions.splice(index, 1);
                    return updatedQuestions;
                  });
                }}
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              placeholder="Question"
              onChange={(e) => {
                setQuestions((prev) => {
                  const updatedQuestions = [...prev];
                  updatedQuestions[index].question = e.target.value;
                  return updatedQuestions;
                });
              }}
              className="dark:placeholder-text-600 rounded-2xl font-cal text-xl placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
            />
            <input
              type="number"
              placeholder="Points"
              onChange={(e) => {
                setQuestions((prev) => {
                  const updatedQuestions = [...prev];
                  updatedQuestions[index].points = parseInt(e.target.value);
                  return updatedQuestions;
                });
              }}
              className="dark:placeholder-text-600 rounded-2xl font-cal text-xl placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
            />

            {question.type === QuestionType.TrueFalse && (
              <div className="flex w-full items-center space-x-3">
                <div className="text-stone-400 dark:text-stone-500">
                  Correct Answer:
                </div>
                <select
                  className="rounded-lg border border-stone-200 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-500"
                  onChange={(e) => {
                    setQuestions((prev) => {
                      const updatedQuestions = [...prev];
                      updatedQuestions[index].correctAnswer = e.target.value;
                      return updatedQuestions;
                    });
                  }}
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        className="rounded-lg bg-stone-400 px-2 py-1 text-sm text-white hover:opacity-75 dark:bg-stone-800 dark:text-stone-500"
        onClick={createQuestions}
      >
        Save Questions
      </button>
    </div>
  );
}
