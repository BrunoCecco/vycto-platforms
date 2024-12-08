import { notFound, redirect } from "next/navigation";
import BucketStorage from "@/components/media/bucketStorage";
import { getCompetitionDataWithSite, getSiteDataById } from "@/lib/fetchers";

export default async function SiteMedia({
  params,
}: {
  params: { id: string };
}) {
  const data = await getCompetitionDataWithSite(decodeURIComponent(params.id));

  const bucketId = data?.site?.bucketId || undefined;
  const bucketName = data?.site?.bucketName || undefined;

  if (!data || !data.site) {
    notFound();
  }

  return (
    <div className="flex flex-col space-y-12">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold sm:text-3xl">Competition Media</h1>
        <h1 className="text-md font-light sm:text-lg">{data.title}</h1>
      </div>
      <BucketStorage
        siteName={data.site.name || ""}
        siteId={data.site.id}
        entity="competition"
        entityData={data}
        bucketName={bucketName}
        bucketId={bucketId}
      />
    </div>
  );
}
