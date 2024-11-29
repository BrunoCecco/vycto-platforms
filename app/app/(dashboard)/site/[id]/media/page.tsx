import { notFound, redirect } from "next/navigation";
import BucketStorage from "@/components/media/bucketStorage";
import { getSiteDataById } from "@/lib/fetchers";

export default async function SiteMedia({
  params,
}: {
  params: { id: string };
}) {
  const data = await getSiteDataById(decodeURIComponent(params.id));

  const bucketId = data?.bucketId;
  const bucketName = data?.bucketName;

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex flex-col items-center space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
            Media for {data.name}
          </h1>
        </div>
      </div>
      <BucketStorage
        siteName={data.name || ""}
        siteId={decodeURIComponent(params.id)}
        bucketName={bucketName}
        bucketId={bucketId}
      />
    </>
  );
}
