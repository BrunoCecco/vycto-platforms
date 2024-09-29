import { getAllUsers } from "@/lib/fetchers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { role, offset, limit } = await req.json();

  const users = await getAllUsers(role, offset, limit);

  return NextResponse.json(users);
}
