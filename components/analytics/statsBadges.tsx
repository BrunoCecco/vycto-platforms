import { BarChart, DollarSign, FileText, Users, Globe } from "lucide-react";

const stats = [
  {
    icon: <BarChart size={24} color="#6C63FF" />,
    label: "Total Engagement",
    value: "350.4 hrs",
  },
  {
    icon: <DollarSign size={24} color="#6C63FF" />,
    label: "Signups",
    value: "642",
  },
  {
    label: "Sales (Lifetime Value)",
    value: "$5,774.34",
    subtext: "+23% since last month",
    subtextColor: "text-green-500",
  },
  {
    icon: <FileText size={24} color="#6C63FF" />,
    label: "Total Plays",
    value: "11.3K",
  },
  {
    icon: <Globe size={24} color="#6C63FF" />,
    label: "Most Plays",
    value: "10.2K",
    flag: <span className="text-3xl">🇨🇾</span>, // Cyprus flag as an example
  },
  {
    icon: <Users size={24} color="#6C63FF" />,
    label: "Power Users",
    value: "154",
  },
];

const StatsBadges = () => {
  return (
    <div className="flex h-28 space-x-4 overflow-x-auto rounded-2xl p-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className=" relative flex min-w-[200px] flex-col justify-center rounded-3xl p-4 shadow-sm"
        >
          <div className="flex items-center space-x-4">
            {stat.icon && (
              <div className="rounded-full bg-purple-100 p-3">{stat.icon}</div>
            )}
            <div className="flex-grow">
              <div className="text-xs ">{stat.label}</div>
              <div className="text-xl font-semibold">{stat.value}</div>
            </div>
            {stat.flag && (
              <div className="top-18 absolute right-4">{stat.flag}</div>
            )}
          </div>
          {stat.subtext && (
            <div className={`pt-1 text-xs ${stat.subtextColor}`}>
              {stat.subtext}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsBadges;
