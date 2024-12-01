"use client";

import LoadingDots from "@/components/icons/loadingDots";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCompetition } from "@/lib/actions";
import va from "@vercel/analytics";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button, Input, Spinner } from "@nextui-org/react";

export default function DeleteCompetitionForm({
  competitionName,
}: {
  competitionName: string;
}) {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  return (
    <form
      action={async (data: FormData) => {
        if (
          window.confirm("Are you sure you want to delete your competition?")
        ) {
          deleteCompetition(data, id, "delete").then((res) => {
            if (res.error) {
              toast.error(res.error);
            } else {
              va.track("Deleted Competition");
              router.refresh();
              router.push(`/site/${res.siteId}`);
              toast.success(`Successfully deleted competition!`);
            }
          });
        }
      }}
      className="rounded-lg border border-red-600 bg-white "
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="text-xl ">Delete Competition</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Deletes your competition permanently. Type in the name of your
          competition <b>{competitionName}</b> to confirm.
        </p>

        <Input
          name="confirm"
          type="text"
          required
          pattern={competitionName}
          placeholder={competitionName}
        />
      </div>

      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t   p-3   sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-center text-sm text-stone-500 dark:text-stone-400">
          This action is irreversible. Please proceed with caution.
        </p>
        <div className="w-32">
          <FormButton />
        </div>
      </div>
    </form>
  );
}

const FormButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button isDisabled={pending}>
      {pending ? <Spinner /> : <p>Confirm Delete</p>}
    </Button>
  );
};
