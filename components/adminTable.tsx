import React, { useState } from "react";
import Image from "next/image"; // Importing Next.js Image component

interface User {
  id: number;
  name: string;
  email: string;
  dateCreated: string;
  isActive: boolean;
  avatarUrl: string;
}

const usersData: User[] = [
  {
    id: 1,
    name: "Mikaela Panayiotou",
    email: "m@cablenet.net",
    dateCreated: "01/04/23",
    isActive: true,
    avatarUrl: "/path/to/avatar1.png", // Replace with actual path
  },
  {
    id: 2,
    name: "Andreas Polyviou",
    email: "andresa@cablenet.net",
    dateCreated: "01/04/23",
    isActive: true,
    avatarUrl: "/path/to/avatar2.png",
  },
  {
    id: 3,
    name: "Chrystalla Christodoulou",
    email: "chrysc@cablenet.net",
    dateCreated: "03/09/23",
    isActive: true,
    avatarUrl: "/path/to/avatar3.png",
  },
];

const AdminTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>(usersData);

  // Function to toggle active status
  const toggleActiveStatus = (id: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isActive: !user.isActive } : user,
      ),
    );
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white px-4 py-6">
      <table className="min-w-full table-auto border-collapse">
        <thead className="text-md border-b-2 bg-white text-left font-medium">
          <tr>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Date Created</th>
            <th className="px-4 py-2">Active</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="flex items-center px-4 py-5">
                <div className="relative mr-3 h-10 w-10">
                  {/* Using Next.js Image component for avatar */}
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
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
              <td className="px-4 py-3 text-gray-500">{user.dateCreated}</td>
              <td className="px-4 py-3">
                {/* Switch for Active Status */}
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={user.isActive}
                    onChange={() => toggleActiveStatus(user.id)}
                    className="peer sr-only"
                  />
                  <div
                    className={`h-5 w-8 rounded-full bg-gray-200 transition-colors duration-300
                      peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-500 peer-focus:ring-offset-2`}
                  ></div>
                  <span
                    className={`absolute left-1 h-3 w-3 transform rounded-full bg-white 
                    transition-transform peer-checked:translate-x-3`}
                  ></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
