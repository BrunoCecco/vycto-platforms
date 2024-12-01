"use client";

import { toast } from "sonner";
import { createSite, createSiteReward } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loadingDots";
import va from "@vercel/analytics";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button, Input, Spinner } from "@nextui-org/react";

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
      className="md: w-full rounded-md  bg-white md:max-w-md md:border md:shadow "
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="text-2xl ">Create a new reward</h2>

        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-sm font-medium  ">
            Reward Title
          </label>
          <Input
            name="title"
            type="text"
            placeholder="Season Tickets"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            maxLength={32}
            required
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t   p-3   md:px-10">
        <FormButton />
      </div>
    </form>
  );
}

const FormButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button isDisabled={pending} type="submit">
      {pending ? <Spinner /> : <p>Create New Reward</p>}
    </Button>
  );
};
