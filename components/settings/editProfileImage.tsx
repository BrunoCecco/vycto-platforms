import Form from "@/components/form";
import { editUser } from "@/lib/actions";
import Image from "next/image";
import { PencilIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function EditProfileImage({ session }: { session: any }) {
  if (!session) {
    redirect("/login");
  }

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
      handleSubmit={editUser}
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
