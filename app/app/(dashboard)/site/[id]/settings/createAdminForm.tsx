"use client";
import { createSiteAdmin } from "@/lib/actions";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";

const CreateAdminForm = ({ siteId }: { siteId: string }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const handleCreate = async () => {
    setLoading(true);
    const res = await createSiteAdmin(siteId, email);
    if ("error" in res) {
      toast.error(res.error);
      setEmail("");
    } else {
      setEmail("");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        name="email"
        type="email"
        placeholder="New Admin Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input name="siteId" type="hidden" value={siteId} />
      <Button isDisabled={loading} onClick={handleCreate}>
        {loading ? "Creating..." : "Create"}
      </Button>
    </div>
  );
};

export default CreateAdminForm;
