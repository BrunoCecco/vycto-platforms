import B2 from "backblaze-b2"; // Import Backblaze B2 SDK
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_MASTER_KEY_ID!,
  applicationKey: process.env.BACKBLAZE_MASTER_KEY!,
});

export async function POST(
  req: Request,
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

  const file = await req.arrayBuffer();

  console.log(`Uploading file to bucket ${bucketid}`); // q: why is bucketId still undefined? a:

  const fileBuffer = Buffer.from(file);
  const contentType = req.headers.get("content-type") || "text/plain";
  const filename = `${nanoid()}.${contentType.split("/")[1]}`;

  // b2 auth tokens are valid for 24 hours
  // .authorize returns the download url,
  // .getUploadUrl returns the upload url and auth token
  const { data: authData } = await b2.authorize();
  const { data: uploadData } = await b2.getUploadUrl({
    bucketId: bucketid,
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
