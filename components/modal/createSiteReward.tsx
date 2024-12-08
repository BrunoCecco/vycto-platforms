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
import { MONTHS } from "@/lib/constants";

export default function CreateSiteReward({
  siteId,
  month,
  year,
}: {
  siteId: string;
  month: number;
  year: number;
}) {
  const router = useRouter();

  const [data, setData] = useState({
    siteId: siteId,
    title: "",
  });

  return (
    <form
      action={async (data: FormData) => {
        data.append("siteId", siteId);
        data.append(
          "title",
          MONTHS.find((m) => m.value === month)?.label || "",
        );
        data.append("month", month.toString());
        data.append("year", year.toString());
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
    >
      <FormButton />
    </form>
  );
}

const FormButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button isDisabled={pending} type="submit">
      {pending ? <Spinner /> : <p>Create Reward</p>}
    </Button>
  );
};
