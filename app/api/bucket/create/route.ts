import B2 from "backblaze-b2"; // Import Backblaze B2 SDK
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_MASTER_KEY_ID!,
  applicationKey: process.env.BACKBLAZE_MASTER_KEY!,
});

const createBucketName = (siteName?: string) => {
  // get date in format "YYYY-MM-DD"
  const date = new Date().toISOString().split("T")[0];
  if (!siteName) {
    return `site-vycto-${date}`;
  }
  return siteName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-vycto-" + date;
};

// Create a backblaze bucket with the given name
// POST /api/bucket/create
export async function POST(req: Request) {
  if (
    !process.env.BACKBLAZE_MASTER_KEY_ID ||
    !process.env.BACKBLAZE_MASTER_KEY
  ) {
    return new Response(
      "Missing Backblaze credentials. Don't forget to add them to your .env file.",
      {
        status: 401,
      },
    );
  }

  const { siteName } = await req.json();

  const { data: authData } = await b2.authorize();

  const bucketName = createBucketName(siteName);

  const { data: bucketData } = await b2.listBuckets();

  if (
    bucketData.buckets.some((bucket: any) =>
      bucket.bucketName.includes(`${bucketName + "-vycto-"}`),
    )
  ) {
    return new Response("Bucket already exists", {
      status: 409,
    });
  }

  const { data } = await b2.createBucket({
    bucketName,
    bucketType: "allPublic",
  });

  return NextResponse.json(data);
}
