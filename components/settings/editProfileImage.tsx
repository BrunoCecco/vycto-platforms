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
      title="Profile Image"
      description="Your profile image will be visible to others."
      helpText="Please select your profile image."
      inputAttrs={{
        name: "image",
        type: "image",
        defaultValue: session.user.image!,
        placeholder: "Profile Image",
      }}
      handleSubmit={handleSubmit}
    >
      <div className="relative h-[100px] w-[100px] cursor-pointer text-black">
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
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-full border border-black">
          <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-black p-2">
            <PencilIcon className="h-full w-full text-white" />
          </div>
        </div>
      </div>
    </Form>
  );
}
