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
  return (
    <>
      {/* Top Header Section */}
      <div className="ease left-0 right-0 top-0 z-30 flex transition-all duration-150 dark:text-white">
        <div className="my-6 mr-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 sm:my-12">
          <Form
            title=""
            description=""
            helpText=""
            inputAttrs={{
              name: "logo",
              type: "file",
              defaultValue: data?.logo!,
            }}
            handleSubmit={updateSite}
          >
            <div className="relative flex h-20 w-52 cursor-pointer items-center justify-center rounded-xl">
              {data?.logo != null && (
                <div className="relative h-full w-full overflow-hidden">
                  <img
                    src={data?.logo as string}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
              {!data?.logo && (
                <div className="relative flex h-20 w-52 cursor-pointer items-center justify-center rounded-xl border-2 border-white">
                  {" "}
                  <Plus className="h-10 w-10 text-white" />
                </div>
              )}
            </div>
          </Form>
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
      <div className="mb-4 hidden h-44 w-full items-center justify-center rounded-xl sm:flex">
        <Form
          title=""
          description=""
          helpText=""
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: data?.image!,
          }}
          handleSubmit={updateSite}
        >
          <div className="relative flex h-44 w-full cursor-pointer items-center justify-center rounded-xl">
            {data?.image != null && (
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src={data?.image as string}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            {!data?.image && (
              <div className="relative flex h-44 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-white">
                {" "}
                <Plus className="h-10 w-10 text-white" />
              </div>
            )}
          </div>
        </Form>
      </div>
    </>
  );
}
