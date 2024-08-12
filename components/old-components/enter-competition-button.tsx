"use client";

import { useModal } from "@/components/modal/provider";
import { enterUserToCompetition } from "@/lib/actions";
import { ReactNode } from "react";

export default function EnterCompetitionButton({
  userId,
  username,
  competitionId,
}: {
  userId: string;
  username: string;
  competitionId: string;
}) {
  return (
    <button
      onClick={() => enterUserToCompetition(userId, username, competitionId)}
      className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
    >
      Enter Competition
    </button>
  );
}
