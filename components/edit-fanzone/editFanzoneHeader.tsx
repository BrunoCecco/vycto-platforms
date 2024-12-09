import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SelectCompetition, SelectSite, sites } from "@/lib/schema";
import { updateSite } from "@/lib/actions";
import Form from "@/components/form";
import BannerMedia from "../media/bannerMedia";
import PlayButton from "../buttons/playButton";

export default function EditFanZoneHeader({
  siteId,
  data,
  latestCompetition,
}: {
  siteId: string;
  data: SelectSite;
  latestCompetition: SelectCompetition | null;
}) {
  return (
    <>
      {/* Top Header Section */}
      <div className="ease left-0 right-0 top-0 z-30 flex transition-all duration-150 ">
        <div className="my-6 mr-auto flex h-max items-center space-x-5 sm:my-12">
          <Form
            title="Site Logo"
            description=""
            helpText=""
            inputAttrs={{
              name: "logo",
              type: "file",
              defaultValue: data?.logo!,
              placeholder: "site logo",
            }}
            handleSubmit={updateSite}
          />
          <Link href={`/comp/${latestCompetition?.slug}` || "/"}>
            <PlayButton color1={data.color1} color2={data.color2}>
              Play
            </PlayButton>
          </Link>
        </div>
      </div>

      {/* Banner Section */}
      <div className="mb-4 w-full items-center justify-center rounded-xl sm:flex">
        <Form
          title="Site Banner"
          description=""
          helpText=""
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: data?.image!,
            placeholder: "site banner",
          }}
          handleSubmit={updateSite}
        />          
      </div>
      <div className="mb-4 w-full">
        <Form
          title="Site Story"
          description="Add a story-style description for your site."
          helpText=""
          inputAttrs={{
            name: "story",
            type: "text",
            defaultValue: data?.story!,
          }}
          handleSubmit={updateSite}
        />
      </div>
    </>
  );
}
