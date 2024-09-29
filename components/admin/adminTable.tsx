"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image"; // Importing Next.js Image component
import { SelectUser } from "@/lib/schema";
import Form from "../form";
import { updateUser } from "@/lib/actions";
import UserForm from "../form/updateuser";
import { USER, USER_ROLES } from "@/lib/constants";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllAdmins, getAllSuperAdmins, getAllUsers } from "@/lib/fetchers";

const AdminTable = () => {
  const [selectedRole, setSelectedRole] = useState(USER);
  const [currentUsers, setCurrentUsers] = useState<SelectUser[]>();
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole, offset, limit }),
      });
      console.log(users);
      const data = await users.json();
      console.log(data);

      setCurrentUsers(data);
    };
    fetchUsers();
  }, [selectedRole, offset, limit]);

  const prevPage = () => {
    if (offset === 0) return;
    setOffset((prev) => prev - limit);
  };

  const nextPage = () => {
    setOffset((prev) => prev + limit);
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white px-4 py-6">
      <div className="flex items-center gap-4">
        <ArrowLeft className="cursor-pointer" onClick={prevPage} />
        <ArrowRight className="cursor-pointer" onClick={nextPage} />
      </div>
      <table className="min-w-full table-auto border-collapse">
        <thead className="text-md border-b-2 bg-white text-left font-medium">
          <tr>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Joined</th>
            <th className="px-4 py-2">
              <span>Role: </span>
              <select
                onChange={(e) => setSelectedRole(e.currentTarget.value)}
                className="ml-2 rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-black"
                value={selectedRole}
                defaultValue={selectedRole}
              >
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {currentUsers &&
            currentUsers.map((user, index) => (
              <tr key={user.id}>
                <td className="flex items-center px-4 py-5">
                  <div className="relative mr-3 h-10 w-10">
                    {/* Using Next.js Image component for avatar */}
                    <Image
                      src={user.image || "/placeholder.png"}
                      alt={user.name ?? user.username ?? "user" + index}
                      fill
                      className="rounded-full object-contain"
                    />
                  </div>
                  <span className="text-gray-900">
                    {user.name ?? user.username ?? "user" + index}
                  </span>
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
                  <UserForm
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
