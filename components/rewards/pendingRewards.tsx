export default function PendingRewards({
  count,
  amount,
}: {
  count: number;
  amount: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {/* <h2 className="text-xl font-semibold">YOUR PENDING REWARDS</h2>
      <p className="text-sm font-bold">COMING SOON...</p>
      <p className="text-xl">€ {amount.toFixed(2)}</p> */}
    </div>
  );
}
