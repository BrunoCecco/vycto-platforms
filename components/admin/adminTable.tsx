import React, { useEffect, useState } from "react";
import Image from "next/image"; // Importing Next.js Image component
import { SelectUser } from "@/lib/schema";
import Form from "../form";
import { updateUser } from "@/lib/actions";
import SelectForm from "../form/select";

const AdminTable = ({
  users,
  admins,
  superAdmins,
}: {
  users: SelectUser[];
  admins: SelectUser[];
  superAdmins: SelectUser[];
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white px-4 py-6">
      <table className="min-w-full table-auto border-collapse">
        <thead className="text-md border-b-2 bg-white text-left font-medium">
          <tr>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Joined</th>
            <th className="px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="flex items-center px-4 py-5">
                <div className="relative mr-3 w-10">
                  {/* Using Next.js Image component for avatar */}
                  <Image
                    src={user.image || "/placeholder.png"}
                    alt={user.name || user.username || ""}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="text-gray-900">{user.name}</span>
              </td>
              <td className="px-4 py-3">
                <a
                  href={`mailto:${user.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {user.email}
                </a>
              </td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <SelectForm
                  inputAttrs={{
                    name: "role",
                    type: "text",
                    defaultValue: user.role!,
                  }}
                  userId={user.id}
                  handleSubmit={updateUser}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
