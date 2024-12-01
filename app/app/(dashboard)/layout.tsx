import { ReactNode, Suspense } from "react";
import Profile from "@/components/nav/profile";
import Nav from "@/components/nav/nav";
import PoweredBadge from "@/components/nav/poweredBadge";
import Loading from "../../../components/ui/loading";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className=" ">
      <Nav isSuperAdmin>
        <div className="mb-8">
          <PoweredBadge />
        </div>
        <Suspense fallback={<Loading />}>
          <Profile />
        </Suspense>
      </Nav>
      <div className="min-h-screen sm:pl-60">{children}</div>
    </div>
  );
}
