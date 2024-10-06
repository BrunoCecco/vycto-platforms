export default function RewardsList() {
  const rewards = [
    {
      event: "UFC 305: du Plessis vs Adesanya",
      date: "22 August 2024 • 10:15 AM",
      claimed: "1 BLOCK",
    },
    {
      event: "Brasileiro Série A • GW22",
      date: "17 August 2024 • 05:57 AM",
      claimed: "1 BLOCK",
    },
  ];

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Your Rewards</h2>
      <div className="overflow-hidden rounded-lg bg-gray-800">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-4 text-left">Event</th>
              <th className="p-4 text-left">Ready to claim</th>
              <th className="p-4 text-left">Total rewards</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map((reward, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="p-4">
                  <p className="font-semibold">{reward.event}</p>
                  <p className="text-sm text-gray-400">{reward.date}</p>
                </td>
                <td className="p-4">
                  <span className="text-orange-500">All claimed</span>
                </td>
                <td className="p-4">{reward.claimed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
