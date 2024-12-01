import { Calendar, BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "jan 08", Facebook: 30, Instagram: 20, Website: 50 },
  { name: "jan 16", Facebook: 20, Instagram: 25, Website: 55 },
  { name: "jan 23", Facebook: 30, Instagram: 30, Website: 60 },
  { name: "feb 09", Facebook: 25, Instagram: 20, Website: 55 },
  { name: "feb 18", Facebook: 35, Instagram: 25, Website: 60 },
  { name: "feb 25", Facebook: 40, Instagram: 25, Website: 60 },
  { name: "mar 25", Facebook: 45, Instagram: 30, Website: 60 },
  { name: "mar 29", Facebook: 55, Instagram: 35, Website: 70 },
  { name: "apr 11", Facebook: 50, Instagram: 30, Website: 65 },
];

const EngagementTraffic = () => {
  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center space-x-2">
          <Calendar size={24} color="#6C63FF" />
          <span className="text-lg font-medium">Engagement</span>
        </div>
        <div className="flex items-center space-x-8">
          <span className="text-lg font-medium ">Traffic</span>
          <BarChart2 className="h-8 w-8 pb-1" color="#6C63FF" />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pb-4">
        <div className="flex items-center space-x-2">
          <span className="inline-block h-3 w-3 rounded-full bg-purple-500"></span>
          <span>Facebook</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-300"></span>
          <span>Instagram</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block h-3 w-3 rounded-full bg-gray-200"></span>
          <span>Website</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barCategoryGap="20%">
          {/* <XAxis dataKey="name" tickLine={false} axisLine={false} /> */}
          <Tooltip />
          <Bar dataKey="Facebook" stackId="a" fill="#6C63FF" barSize={10} />
          <Bar dataKey="Instagram" stackId="a" fill="#60A5FA" barSize={10} />
          <Bar
            dataKey="Website"
            stackId="a"
            fill="#D3D3D3"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-between pt-4 text-sm ">
        {data.map((entry, index) => (
          <span key={index}>{entry.name}</span>
        ))}
      </div>
    </div>
  );
};

export default EngagementTraffic;
