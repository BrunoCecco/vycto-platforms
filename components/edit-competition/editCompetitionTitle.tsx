"use client";

import { updateCompetitionMetadata } from "@/lib/actions";
import { SelectCompetition } from "@/lib/schema";
import { Input } from "@nextui-org/react";

export default function EditCompetitionTitle({
  competition,
}: {
  competition: SelectCompetition & { site: any };
}) {
  return (
    <div className="mb-5 flex w-full flex-col space-y-3">
      <label htmlFor="title" className="text-xl font-bold ">
        Competition Title
      </label>
      <Input
        id="title-editor"
        type="text"
        placeholder="Title"
        defaultValue={competition?.title || ""}
        onChange={async (e) => {
          const formData = new FormData();
          formData.append("title", e.target.value);
          const response = await updateCompetitionMetadata(
            formData,
            competition.id,
            "title",
          );
          console.log(response);
        }}
      />
    </div>
  );
}
