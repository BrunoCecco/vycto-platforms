import Button from "../buttons/button";

export default function ClaimedRewards({
  count,
  amount,
}: {
  count: number;
  amount: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h2 className="text-xl font-semibold">TOTAL CLAIMED</h2>
      <p className="text-3xl font-bold">COMING SOON...</p>
      {/* <p className="text-xl">€ {amount.toFixed(2)}</p> */}
    </div>
  );
}
