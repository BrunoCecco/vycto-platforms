import { getAllUsers } from "@/lib/fetchers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { offset, limit } = await req.json();

  const users = await getAllUsers(offset, limit);

  return NextResponse.json(users);
}
