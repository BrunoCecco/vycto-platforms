"use client";

import { toast } from "sonner";
import { createSite, createSiteReward } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loadingDots";
import va from "@vercel/analytics";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

export default function CreateSiteRewardModal({ siteId }: { siteId: string }) {
  const router = useRouter();

  const [data, setData] = useState({
    siteId: siteId,
    title: "",
  });

  return (
    <form
      action={async (data: FormData) => {
        data.append("siteId", siteId);
        data.append("startDate", new Date().toISOString());
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        data.append("endDate", endDate.toISOString());
        createSiteReward(data).then((res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Created Reward");
            toast.success(`Successfully created reward!`);
          }
          setData({ siteId: siteId, title: "" });
        });
      }}
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="text-2xl dark:text-white">Create a new reward</h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Reward Title
          </label>
          <input
            name="title"
            type="text"
            placeholder="Season Tickets"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <FormButton />
      </div>
    </form>
  );
}

const FormButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Create New Reward</p>}
    </button>
  );
};
