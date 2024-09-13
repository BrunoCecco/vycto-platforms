import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SelectCompetition } from "@/lib/schema";
import Form from "./form";
import { updateSite } from "@/lib/actions";

export default function EditFanZoneHeader({
  data,
  latestCompetition,
}: {
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
          {/* {data.logo ? (
            <Image
              className="rounded-xl"
              alt={data.name || ""}
              height={80}
              src={data.logo}
              width={200}
            />
          ) : (
            <div className="flex h-20 w-52 items-center justify-center rounded-xl border-2 border-white">
              <Plus className="h-10 w-10 text-white" />
            </div>
          )} */}
          <div className="relative w-[300px]">
            <Form
              title=""
              description=""
              helpText="Max file size 50MB. Recommended size 1200x630."
              inputAttrs={{
                name: "logo",
                type: "file",
                defaultValue: data?.logo!,
              }}
              handleSubmit={updateSite}
            />
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
      <div className="mb-4 hidden h-44 w-full items-center justify-center rounded-xl sm:flex">
        <Form
          title=""
          description=""
          helpText="Max file size 50MB. Recommended size 400x400."
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: data?.image!,
          }}
          handleSubmit={updateSite}
        />
      </div>
    </>
  );
}
