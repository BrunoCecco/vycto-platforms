import { del } from "@vercel/blob";

export async function DELETE(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response(
      "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
      {
        status: 401,
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get("url") as string;
  await del(urlToDelete);

  return new Response(null, { status: 204 });
}
