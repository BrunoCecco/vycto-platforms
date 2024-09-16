"use client";

import { updateCompetitionMetadata } from "@/lib/actions";
import { SelectCompetition } from "@/lib/schema";

export default function EditCompetitionTitle({
  competition,
}: {
  competition: SelectCompetition & { site: any };
}) {
  return (
    <div className="mb-5 flex w-full flex-col space-y-3 border-b border-stone-200 dark:border-stone-700">
      <label htmlFor="title" className="text-lg font-bold">
        Competition Title
      </label>
      <input
        id="title-editor"
        type="text"
        placeholder="Title"
        defaultValue={competition?.title || ""}
        onBlur={async (e) => {
          const formData = new FormData();
          formData.append("title", e.target.value);
          const response = await updateCompetitionMetadata(
            formData,
            competition.id,
            "title",
          );
          console.log(response);
        }}
        className="dark:placeholder-text-600 border-none px-0 font-cal text-3xl placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
      />
    </div>
  );
}
