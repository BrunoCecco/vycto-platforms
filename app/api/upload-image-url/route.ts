import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response(
      "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
      {
        status: 401,
      },
    );
  }

  // Parse the request body to get the image URL
  const { imageUrl } = await req.json();

  if (!imageUrl) {
    return new Response("Missing imageUrl in request body", {
      status: 400,
    });
  }

  // Fetch the image from the provided URL
  const imageResponse = await fetch(imageUrl);

  if (!imageResponse.ok) {
    return new Response("Failed to fetch image from URL", {
      status: 400,
    });
  }

  const imageBuffer = await imageResponse.arrayBuffer();
  const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
  const filename = `${nanoid()}.${contentType.split("/")[1]}`;

  // Upload the image to Vercel Blob Storage
  const blob = await put(filename, Buffer.from(imageBuffer), {
    contentType,
    access: "public",
  });

  return NextResponse.json(blob);
}
