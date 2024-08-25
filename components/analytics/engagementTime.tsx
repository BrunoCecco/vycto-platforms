import { Calendar, BarChart2, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "SEPT.", participation: 200, hours: 400, amt: 2400 },
  { name: "OCT.", participation: 350, hours: 500, amt: 2400 },
  { name: "DEC.", participation: 180, hours: 350, amt: 2400 },
  { name: "JAN.", participation: 250, hours: 380, amt: 2400 },
  { name: "FEB.", participation: 200, hours: 400, amt: 2400 },
  { name: "MAR.", participation: 270, hours: 460, amt: 2400 },
];

const EngagementTime = () => {
  return (
    <div className="mx-auto h-full w-1/2 rounded-2xl bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center space-x-2">
          <Calendar size={24} color="#6C63FF" />
          <span className="text-lg font-medium">Engagement</span>
        </div>
        <div className="flex items-center space-x-8">
          <span className="text-lg font-medium text-gray-600">Game Time</span>
          <BarChart2 size={24} className="h-8 w-8 pb-1" color="#6C63FF" />
        </div>
      </div>

      <div className="flex items-start space-x-10">
        <div>
          <h2 className="text-2xl font-bold">$350.4hrs</h2>
          <p className="text-xs text-gray-500">
            Total Spent
            <span className="ml-2 text-green-500">+2.45%</span>
          </p>
          <div className="mt-4 flex items-center space-x-1">
            <CheckCircle2 size={24} fill="#34d399" color="#ffffff" />
            <span className="text-emerald-400">On track</span>
          </div>
        </div>

        <div className="flex-grow">
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={data}>
              {/* <XAxis dataKey="name" axisLine={false} tickLine={false} /> */}
              <Tooltip />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#6C63FF"
                strokeWidth={3}
                // dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="participation"
                stroke="#60A5FA"
                strokeWidth={3}
                // dot={{ r: 5, fill: "#60A5FA" }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-between pt-4 text-sm text-gray-400">
            {data.map((entry, index) => (
              <span key={index}>{entry.name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementTime;
