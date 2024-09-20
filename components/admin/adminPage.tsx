import React from "react";
import AdminTable from "./adminTable";

const AdminPage: React.FC = () => {
  return (
    <div className="m-10 space-y-6">
      <h1 className="text-xl font-semibold">User Admin</h1>
      <button className="font-medium text-gray-600">+ Add User</button>
      <AdminTable />
    </div>
  );
};

export default AdminPage;
