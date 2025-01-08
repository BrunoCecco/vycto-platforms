"use client";

import { toast } from "sonner";
import { createSite, createSiteAdmin } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loadingDots";
import { useModal } from "./provider";
import va from "@vercel/analytics";
import { useEffect, useState } from "react";
import { Input, Spinner, Button, Textarea } from "@nextui-org/react";
import { e } from "@vercel/blob/dist/put-96a1f07e";

export default function CreateSiteModal() {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    name: "",
    subdomain: "",
    description: "",
  });

  const [admin, setAdmin] = useState("");

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      subdomain: prev.name
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, "-"),
    }));
  }, [data.name]);

  return (
    <form
      action={async (data: FormData) =>
        createSite(data).then((siteRes) => {
          if ("error" in siteRes) {
            toast.error(siteRes.error + ": Error creating site");
          } else {
            createSiteAdmin(siteRes.id, admin, false).then((res: any) => {
              if (res.error) {
                toast.error(res.error + ": Error creating site admin");
              } else {
                va.track("Created Site");
                const { id } = siteRes;
                router.refresh();
                router.push(`/site/${id}`);
                modal?.hide();
                toast.success(`Successfully created site!`);
              }
            });
          }
        })
      }
      className="md: w-full rounded-md bg-background md:max-w-md md:border md:shadow"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="text-2xl ">Create a new site</h2>

        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-sm font-medium  ">
            Site Name
          </label>
          <Input
            name="name"
            type="text"
            placeholder="My Awesome Site"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            maxLength={32}
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="subdomain" className="text-sm font-medium">
            Subdomain
          </label>
          <div className="flex w-full max-w-md">
            <Input
              name="subdomain"
              type="text"
              placeholder="subdomain"
              value={data.subdomain}
              onChange={(e) => setData({ ...data, subdomain: e.target.value })}
              autoCapitalize="off"
              pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
              maxLength={32}
              required
            />
            <div className="flex -translate-x-2 items-center rounded-r-xl bg-content2 px-3 text-sm">
              .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="adminEmail" className="text-sm font-medium ">
            Sponsor Admin Email
          </label>
          <Textarea
            name="admin"
            placeholder="johndoe@mail.com"
            value={admin}
            onChange={(e) => setAdmin(e.target.value)}
            maxLength={40}
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t p-3 md:px-10">
        <CreateSiteFormButton />
      </div>
    </form>
  );
}
function CreateSiteFormButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isDisabled={pending}>
      {pending ? <Spinner /> : <p>Create Playground</p>}
    </Button>
  );
}
