import React from "react";
import AdminTable from "./adminTable";
import { getAllAdmins, getAllSuperAdmins, getAllUsers } from "@/lib/fetchers";

const AdminPage = async () => {
  const users = await getAllUsers(50);
  const superAdmins = await getAllSuperAdmins();
  const admins = await getAllAdmins();
  return (
    <div className="m-10 space-y-6">
      <AdminTable users={users} admins={admins} superAdmins={superAdmins} />
    </div>
  );
};

export default AdminPage;
