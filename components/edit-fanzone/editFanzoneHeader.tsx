import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SelectCompetition, sites } from "@/lib/schema";
import { updateSite } from "@/lib/actions";
import Form from "@/components/form";
import BannerMedia from "../media/bannerMedia";

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
        <div className="my-6 mr-auto flex h-32  items-center justify-center space-x-5 overflow-hidden sm:my-12">
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
            <div className="relative h-[100px] w-[100px]">
              {data?.logo != null && (
                <Image
                  className="h-full w-full rounded-xl object-contain"
                  fill
                  alt={data.name || ""}
                  src={data.logo || ""}
                />
              )}
              <div className="absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-gray-700 opacity-25">
                <Plus className="h-10 w-10 text-white" />
              </div>
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
      <div className="mb-4 hidden w-full items-center justify-center rounded-xl sm:flex">
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
          <div className="relative flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl sm:h-[30vw]">
            {data.image ? <BannerMedia src={data.image} /> : null}
            <div className="absolute flex h-full w-full cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-gray-700 opacity-25">
              <Plus className="h-10 w-10 text-white" />
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}
