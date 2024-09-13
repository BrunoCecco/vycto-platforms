"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SelectCompetition, sites } from "@/lib/schema";
import { updateSite } from "@/lib/actions";
import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import Form from "./form";
import db from "@/lib/db";
import { eq } from "drizzle-orm";

export default function EditFanZoneHeader({
  siteId,
  data,
  latestCompetition,
}: {
  siteId: string;
  data: {
    name: string | null;
    logo: string | null;
    image: string | null;
    color2: string | null;
  };
  latestCompetition: SelectCompetition | null;
}) {
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      // Optionally handle file upload or validation here
      toast.success("Logo file selected!");
      await fetch("/api/upload", {
        method: "POST",
        headers: { "content-type": logoFile?.type || "application/json" },
        body: logoFile,
      }).then(async (res) => {
        console.log("Post done");
        if (res.status === 200) {
          console.log("Post successful");
          const { url } = await res.json();
          const response = await db
            .update(sites)
            .set({
              ["logo"]: url,
            })
            .where(eq(sites.id, siteId))
            .returning()
            .then((res) => res[0]);
          console.log("DB write done");
        }
      });
    }
  };

  return (
    <>
      {/* Top Header Section */}
      <div className="ease left-0 right-0 top-0 z-30 flex transition-all duration-150 dark:text-white">
        <div className="my-6 mr-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 sm:my-12">
          {!data.logo ? (
            <Image
              className="rounded-xl"
              alt={data.name || ""}
              height={80}
              src={data.logo}
              width={200}
            />
          ) : (
            <div className="relative flex h-20 w-52 items-center justify-center rounded-xl border-2 border-white">
              <Plus className="h-10 w-10 text-white" />
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleLogoChange}
              />
            </div>
          )}
          <div className="relative w-[300px]">
            {/* <Form
              title=""
              description=""
              helpText="Max file size 50MB. Recommended size 1200x630."
              inputAttrs={{
                name: "logo",
                type: "file",
                defaultValue: data?.logo!,
              }}
              handleSubmit={updateSite}
            /> */}
          </div>
          <Link
            className="ml-3 rounded-full bg-blue-200 px-8 py-2 pt-1 font-semibold text-white"
            style={{ backgroundColor: data.color2 || "#1E40AF" }} // Default color fallback
            href={`/comp/${latestCompetition?.slug}` ?? "/"}
          >
            Play
          </Link>
        </div>
      </div>

      {/* Banner Section */}
      <div className="mb-4 hidden h-44 w-full items-center justify-center overflow-hidden rounded-xl sm:flex">
        {data.image ? (
          <Image
            src={data.image ?? "/placeholder.png"}
            unoptimized
            alt="Banner Image"
            width={1}
            height={1}
            objectFit="cover"
            className="h-100% w-auto"
          />
        ) : (
          <button className="flex h-full w-full items-center justify-center rounded-xl border-2 border-white">
            <Plus className="h-10 w-10 text-white" />
          </button>
        )}
        {/* <Form
          title=""
          description=""
          helpText="Max file size 50MB. Recommended size 400x400."
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: data?.image!,
          }}
          handleSubmit={updateSite}
        /> */}
      </div>
    </>
  );
}
