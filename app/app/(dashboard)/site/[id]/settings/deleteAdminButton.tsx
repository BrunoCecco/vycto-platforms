"use client";
import { deleteSiteAdmin } from "@/lib/actions";
import { Button } from "@nextui-org/react";

const DeleteAdminButton = ({
  email,
  siteId,
}: {
  email: string;
  siteId: string;
}) => {
  "use client";

  const handleDelete = async () => {
    const res = await deleteSiteAdmin(siteId, email);
  };

  return <Button onClick={handleDelete}>Delete</Button>;
};

export default DeleteAdminButton;
