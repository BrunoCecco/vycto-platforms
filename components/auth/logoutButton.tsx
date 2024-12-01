"use client";

import { Button } from "@nextui-org/react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <Button onClick={() => signOut()}>
      <LogOut width={18} />
    </Button>
  );
}
