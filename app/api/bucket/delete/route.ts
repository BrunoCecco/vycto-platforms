import B2 from "backblaze-b2"; // Import Backblaze B2 SDK
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_MASTER_KEY_ID!,
  applicationKey: process.env.BACKBLAZE_MASTER_KEY!,
});

// Delete a backblaze bucket with the given name
// POST /api/bucket/delete
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

  const { bucketName } = await req.json();

  if (!bucketName) {
    return new Response("Missing bucketName in request body", {
      status: 400,
    });
  }

  const { data: authData } = await b2.authorize();

  const { data } = await b2.getBucket({
    bucketName,
  });

  if (!data) {
    return new Response("Bucket not found", {
      status: 404,
    });
  }

  await b2.deleteBucket({
    bucketId: data.bucketId,
  });

  return NextResponse.json({
    message: `Bucket ${bucketName} deleted`,
  });
}
