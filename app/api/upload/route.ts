// import { put, del } from "@vercel/blob";
// import { nanoid } from "nanoid";
// import { NextResponse } from "next/server";

// export const runtime = "edge";

// export async function POST(req: Request) {
//   if (!process.env.BLOB_READ_WRITE_TOKEN) {
//     return new Response(
//       "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
//       {
//         status: 401,
//       },
//     );
//   }

//   const file = req.body || "";
//   const contentType = req.headers.get("content-type") || "text/plain";
//   const filename = `${nanoid()}.${contentType.split("/")[1]}`;
//   const blob = await put(filename, file, {
//     contentType,
//     access: "public",
//   });

//   return NextResponse.json(blob);
// }

import B2 from "backblaze-b2"; // Import Backblaze B2 SDK
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_APP_KEY_ID!,
  applicationKey: process.env.BACKBLAZE_APP_KEY!,
});

export async function POST(req: Request) {
  if (!process.env.BACKBLAZE_APP_KEY_ID || !process.env.BACKBLAZE_APP_KEY) {
    return new Response(
      "Missing Backblaze credentials. Don't forget to add them to your .env file.",
      {
        status: 401,
      },
    );
  }

  const file = await req.arrayBuffer();
  const fileBuffer = Buffer.from(file);
  const contentType = req.headers.get("content-type") || "text/plain";
  const filename = `${nanoid()}.${contentType.split("/")[1]}`;

  // b2 auth tokens are valid for 24 hours
  // .authorize returns the download url,
  // .getUploadUrl returns the upload url and auth token
  const { data: authData } = await b2.authorize();
  const { data: uploadData } = await b2.getUploadUrl({
    bucketId: process.env.BACKBLAZE_BUCKET_ID!,
  });

  const { data } = await b2.uploadFile({
    uploadUrl: uploadData.uploadUrl,
    uploadAuthToken: uploadData.authorizationToken,
    data: fileBuffer,
    // there are no real directories in b2, if you want to place
    // your file in a folder structure, do so with slashes. ex:
    //   fileName: `/my-subfolder/uploads/${fileName}`
    fileName: filename,
    // info: {}, // store optional info, like original file name
  });

  // construct friendly url to return in the response
  const bucketName = authData.allowed.bucketName;
  const downloadURL = authData.downloadUrl;

  const url = `${downloadURL}/file/${bucketName}/${data.fileName}?timestamp=${data.uploadTimestamp}`;

  console.log(`Uploaded file to ${url}`);

  return NextResponse.json({
    url: url,
  });
}
