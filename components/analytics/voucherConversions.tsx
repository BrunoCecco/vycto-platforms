// components/VoucherConversions.tsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Calendar,
} from "lucide-react";

const data = [
  { name: "Sent", value: 20, color: "#F59E0B" },
  { name: "Opened", value: 20, color: "#FB7185" },
  { name: "Used", value: 60, color: "#3B82F6" },
];

const VoucherConversions: React.FC = () => {
  return (
    <div className="mx-auto w-full rounded-xl bg-white p-6 shadow-lg md:w-1/2">
      {/* Header Section */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center space-x-2">
          <Calendar size={24} color="#6C63FF" />
          <span className="text-lg font-medium">Conversion</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium text-gray-600">
            Voucher Conversions
          </span>
          <MoreHorizontal className="h-6 w-6 text-gray-500" />
        </div>
      </div>

      {/* Month and Arrows for Pie Chart */}
      <div className="flex w-1/2 items-center justify-between pb-4 pr-4">
        <ChevronLeft className="h-5 w-5 cursor-pointer text-gray-400" />
        <span className="px-2 text-gray-600">April</span>
        <ChevronRight className="h-5 w-5 cursor-pointer text-gray-400" />
      </div>

      {/* Pie Chart and Details */}
      <div className="flex flex-col items-center md:flex-row">
        {/* Pie Chart */}
        <div className="flex flex-1 justify-center">
          <PieChart width={200} height={200}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Details Section */}
        <div className="-mt-10 flex-1 md:pl-6">
          <div className="space-y-4">
            {/* Details with Subheading for April */}
            <div className="border-b pb-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-gray-800">
                  Vouchers Sent
                </div>
                <div className="text-base font-bold text-gray-800">
                  1512 <span className="text-green-500">↑</span>
                </div>
              </div>
              <div className="-mt-1 text-xs text-gray-500">April</div>
            </div>

            <div className="border-b pb-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-gray-800">
                  Vouchers Opened
                </div>
                <div className="text-base font-bold text-gray-800">
                  940 <span className="text-green-500">↑</span>
                </div>
              </div>
              <div className="-mt-1 text-xs text-gray-500">April</div>
            </div>

            <div className="border-b pb-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-gray-800">
                  Vouchers Used
                </div>
                <div className="text-base font-bold text-gray-800">
                  382 <span className="text-green-500">↑</span>
                </div>
              </div>
              <div className="-mt-1 text-xs text-gray-500">April</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherConversions;
