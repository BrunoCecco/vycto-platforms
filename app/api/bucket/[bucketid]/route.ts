import B2 from "backblaze-b2"; // Import Backblaze B2 SDK
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_MASTER_KEY_ID!,
  applicationKey: process.env.BACKBLAZE_MASTER_KEY!,
});

// Get media from a backblaze bucket with the given name
// POST /api/bucket/{bucketName}
export async function GET(
  _req: Request,
  { params }: { params: { bucketid: string } },
) {
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

  const { bucketid } = params;
  const { data: authData } = await b2.authorize();

  const { data: fileData } = await b2.listFileNames({
    bucketId: bucketid,
    startFileName: "",
    maxFileCount: 100,
    delimiter: "",
    prefix: "",
  });

  const data = {
    ...authData,
    ...fileData,
  };

  return NextResponse.json(data);
}
