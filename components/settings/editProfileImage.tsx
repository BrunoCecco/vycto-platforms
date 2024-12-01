"use client";
import Form from "@/components/form";
import { editUser } from "@/lib/actions";
import Image from "next/image";
import { PencilIcon } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

export default function EditProfileImage() {
  const { data: session, status, update } = useSession();

  if (!session || !session.user) return;

  const handleSubmit = async (data: FormData, _id: string, key: string) => {
    const newValue = data.get(key) as string;
    if (!session) return;
    // @ts-expect-error
    if (session.user[key] === newValue) return { error: "No changes made." };

    // Update the user session directly
    await update({
      user: {
        ...session.user,
        [key]: newValue,
      },
    });

    return editUser(data, _id, key);
  };

  return (
    <Form
      title=""
      description=""
      helpText=""
      inputAttrs={{
        name: "image",
        type: "image",
        defaultValue: session.user.image!,
        placeholder: "Profile Image",
      }}
      handleSubmit={handleSubmit}
    >
      <div className="relative mx-auto h-[150px] w-[150px] cursor-pointer ">
        {session?.user.image != null ? (
          <Image
            className="h-full w-full rounded-full object-contain"
            fill
            alt={session.user.name || ""}
            src={session.user.image}
          />
        ) : (
          <Image
            className="h-full w-full rounded-full object-contain"
            fill
            alt="Profile Image"
            src={`https://avatar.vercel.sh/${session.user.email}`}
          />
        )}
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-full border border-gray-400">
          <div className="absolute -bottom-0 -right-0 h-10 w-10 rounded-full border-2 border-gray-200 bg-white p-2 hover:bg-gray-200">
            <PencilIcon className="h-full w-full " />
          </div>
        </div>
      </div>
    </Form>
  );
}
