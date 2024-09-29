import { Suspense } from "react";
import Loading from "../loading";
import AdminPage from "@/components/admin/adminPage";

export default function Admin() {
  return (
    <div className="flex  flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            Admin Dashboard
          </h1>
        </div>
        <Suspense fallback={<Loading />}>
          <AdminPage />
        </Suspense>
      </div>
    </div>
  );
}
