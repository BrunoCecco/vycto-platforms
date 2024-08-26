import { ReactNode, Suspense } from "react";
import Profile from "@/components/old-components/profile";
import Nav from "@/components/old-components/nav";
import PoweredBadge from "@/components/poweredBadge";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Nav>
        <div className="mb-8">
          <PoweredBadge />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      </Nav>
      <div className="min-h-screen sm:pl-60 dark:bg-black">{children}</div>
    </div>
  );
}
