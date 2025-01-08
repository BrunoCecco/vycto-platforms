"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image"; // Importing Next.js Image component
import { SelectUser } from "@/lib/schema";
import Form from "../form";
import { updateUser } from "@/lib/actions";
import UserForm from "../form/updateuser";
import { USER, USER_ROLES } from "@/lib/constants";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllAdmins, getAllUsers } from "@/lib/fetchers";
import { Select, SelectItem, Spinner } from "@nextui-org/react";

const AdminTable = () => {
  const [currentUsers, setCurrentUsers] = useState<SelectUser[]>();
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const users = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ offset, limit }),
          cache: "no-store",
        });
        const data = await users.json();
        setCurrentUsers(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [offset, limit]);

  const prevPage = () => {
    if (offset === 0) return;
    setOffset((prev) => prev - limit);
  };

  const nextPage = () => {
    setOffset((prev) => prev + limit);
  };

  return (
    <div className="overflow-x-auto rounded-2xl px-4 py-6">
      <div className="flex items-center gap-4">
        <ArrowLeft className="cursor-pointer" onClick={prevPage} />
        <ArrowRight className="cursor-pointer" onClick={nextPage} />
      </div>
      <table className="min-w-full table-auto border-collapse">
        <thead className="border-b-2 text-left text-sm font-medium">
          <tr>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Joined</th>
          </tr>
        </thead>
        <tbody className="">
          {loading ? (
            <Spinner />
          ) : (
            currentUsers &&
            currentUsers.map((user, index) => (
              <tr key={user.id}>
                <td className="flex items-center px-4 py-5">
                  <div className="relative mr-3 h-10 w-10">
                    {/* Using Next.js Image component for avatar */}
                    <Image
                      src={user.image || "/placeholder.png"}
                      alt={user.name || user.username || "user" + index}
                      fill
                      className="rounded-full object-contain"
                    />
                  </div>
                  <span className="">
                    {user.name || user.username || "user" + index}
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
                <td className="px-4 py-3 ">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
