import { del } from "@vercel/blob";
import B2 from "backblaze-b2"; // Import Backblaze B2 SDK
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_APP_KEY_ID!,
  applicationKey: process.env.BACKBLAZE_APP_KEY!,
});

// DELETE A FILE
export async function POST(req: Request) {
  const body = await req.json();

  const url = body.url;

  if (url.includes("backblaze")) {
    const { data: authData } = await b2.authorize();

    if (!process.env.BACKBLAZE_APP_KEY_ID || !process.env.BACKBLAZE_APP_KEY) {
      return new Response(
        "Missing Backblaze credentials. Don't forget to add them to your .env file.",
        {
          status: 401,
        },
      );
    }
    // url format is `${downloadURL}/file/${bucketName}/${data.fileName}?timestamp=${data.uploadTimestamp}`;
    // name is part before ?timestamp
    const fileName = url.split("?")[0].split("/").pop() as string;

    const { data: fileData } = await b2.listFileNames({
      bucketId: process.env.BACKBLAZE_BUCKET_ID!,
      startFileName: fileName,
      maxFileCount: 1,
      delimiter: "",
      prefix: "",
    });

    console.log(fileData);

    console.log(`Deleting ${fileName}`);

    const res = await b2.deleteFileVersion({
      fileId: fileData.files[0].fileId,
      fileName: fileName,
    });

    console.log(`Status ${res.status}`);

    return NextResponse.json({
      status: res.status,
    });
  } else if (url.includes("vercel")) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return new Response(
        "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
        {
          status: 401,
        },
      );
    }
    await del(url);
    return NextResponse.json({
      status: "deleted",
    });
  }
}
