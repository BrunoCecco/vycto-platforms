"use client";
import { deleteSiteAdmin } from "@/lib/actions";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";

const DeleteAdminButton = ({
  email,
  siteId,
}: {
  email: string;
  siteId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteSiteAdmin(siteId, email);
    if ("error" in res) {
      toast.error(res.error);
    } else {
      toast.success("Admin removed successfully.");
    }
  };

  return (
    <Button
      isDisabled={loading}
      onClick={handleDelete}
      className="bg-danger-500"
    >
      {loading ? "Removing..." : "Remove"}
    </Button>
  );
};

export default DeleteAdminButton;
