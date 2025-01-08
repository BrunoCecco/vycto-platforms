"use client";
import { createSiteAdmin } from "@/lib/actions";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

const CreateAdminForm = ({ siteId }: { siteId: string }) => {
  const [email, setEmail] = useState("");
  const handleCreate = async () => {
    const res = await createSiteAdmin(siteId, email);
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        name="email"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input name="siteId" type="hidden" value={siteId} />
      <Button onClick={handleCreate}>Create</Button>
    </div>
  );
};

export default CreateAdminForm;
