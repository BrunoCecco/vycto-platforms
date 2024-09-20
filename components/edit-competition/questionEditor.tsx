import { ExternalLink } from "lucide-react";
import type { SelectCompetition, SelectQuestion } from "@/lib/schema";
import QuestionBuilder from "./questionBuilder";

type CompetitionWithSite = SelectCompetition & {
  site: { subdomain: string | null } | null;
};

export default function QuestionEditor({
  competition,
  initialQuestions,
}: {
  competition: CompetitionWithSite;
  initialQuestions: SelectQuestion[];
}) {
  const data = competition;

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/comp/${data.slug}`
    : `http://${data.site?.subdomain}.localhost:3000/comp/${data.slug}`;

  return (
    <div className="max-w-screen relative min-h-[500px] w-full border-stone-200 p-12 px-8 pt-24 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:pt-12 sm:shadow-lg dark:border-stone-700">
      <div className="absolute right-5 top-16 mb-5 flex items-center space-x-3 sm:top-5">
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
      </div>
      <QuestionBuilder
        competitionId={competition.id}
        initialQuestions={initialQuestions}
      />
    </div>
  );
}
