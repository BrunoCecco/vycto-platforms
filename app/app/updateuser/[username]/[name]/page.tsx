import { updateName, updateUsername } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UpdateUserNameAndName({
  params,
}: {
  params: { username: string; name: string };
}) {
  const username = params.username;
  const name = params.name;
  const session = await getSession();
  if (username) {
    await updateUsername(username, session?.user.email as string);
  }
  if (name) {
    await updateName(name, session?.user.email as string);
  }
  redirect("/");
}
