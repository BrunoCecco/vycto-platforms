import { ReactNode, Suspense } from "react";
import Profile from "@/components/nav/profile";
import Nav from "@/components/nav/nav";
import PoweredBadge from "@/components/nav/poweredBadge";
import Loading from "./loading";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SUPER_ADMIN } from "@/lib/constants";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role != SUPER_ADMIN) {
    redirect("https://vycto.tech");
  }

  return (
    <div>
      <Nav>
        <div className="mb-8">
          <PoweredBadge />
        </div>
        <Suspense fallback={<Loading />}>
          <Profile />
        </Suspense>
      </Nav>
      <div className="min-h-screen sm:pl-60 dark:bg-black">{children}</div>
    </div>
  );
}
