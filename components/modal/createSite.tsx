"use client";

import { toast } from "sonner";
import { createSite } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loadingDots";
import { useModal } from "./provider";
import va from "@vercel/analytics";
import { useEffect, useState } from "react";
import { Input, Spinner, Button } from "@nextui-org/react";

export default function CreateSiteModal() {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    name: "",
    subdomain: "",
    description: "",
    admin: "",
  });

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
        createSite(data).then((res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Created Site");
            const { id } = res;
            router.refresh();
            router.push(`/site/${id}`);
            modal?.hide();
            toast.success(`Successfully created site!`);
          }
        })
      }
      className="md: w-full rounded-md  bg-white md:max-w-md md:border md:shadow "
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="text-2xl ">Create a new site</h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
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
            className="w-full rounded-md border   px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black    dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="subdomain"
            className="text-sm font-medium text-stone-500"
          >
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
            <div className="flex items-center rounded-r-lg border border-l-0   px-3 text-sm   dark:text-stone-400">
              .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        </div>
        {/* 
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-stone-500"
          >
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description about why my site is so awesome"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            maxLength={140}
            rows={3}
            className="w-full rounded-md border   px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black  focus:outline-none focus:ring-black    dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div> */}

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="adminEmail"
            className="text-sm font-medium text-stone-500"
          >
            Sponsor Admin Email
          </label>
          <textarea
            name="admin"
            placeholder="johndoe@mail.com"
            value={data.admin}
            onChange={(e) => setData({ ...data, admin: e.target.value })}
            maxLength={40}
            className="w-full rounded-md border   px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black  focus:outline-none focus:ring-black    dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t   p-3   md:px-10">
        <CreateSiteFormButton />
      </div>
    </form>
  );
}
function CreateSiteFormButton() {
  const { pending } = useFormStatus();
  return (
    <Button isDisabled={pending}>
      {pending ? <Spinner /> : <p>Create Playground</p>}
    </Button>
  );
}
