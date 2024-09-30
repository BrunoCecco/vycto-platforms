import { getUserData } from "@/lib/fetchers";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { email: string } },
) {
  const user = await getUserData(params.email);
  if (!user) {
    return new Response("User not found", {
      status: 404,
    });
  }

  return NextResponse.json(user);
}
