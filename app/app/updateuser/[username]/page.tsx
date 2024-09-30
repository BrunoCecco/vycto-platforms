import { updateName, updateUsername } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UpdateUserName({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;
  const session = await getSession();
  if (username) {
    await updateUsername(username, session?.user.email as string);
  }
  redirect("/");
}
