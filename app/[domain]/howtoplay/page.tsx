import UserSettings from "@/components/settings/userSettings";

export default async function SettingsPage() {
  // explain how to play with beautiful layouy
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-white">How to Play</h1>

      <div className="mb-8 rounded-lg bg-slate-700 p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          1. Enter a Competition
        </h2>
        <p className="mb-2 text-gray-300">
          Browse our active competitions and click &ldquo;Play&ldquo;.
        </p>
      </div>

      <div className="mb-8 rounded-lg bg-slate-700 p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          2. Answer Questions
        </h2>
        <p className="mb-2 text-gray-300">Submit your answers!</p>
      </div>

      <div className="mb-8 rounded-lg bg-slate-700 p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          3. Earn Points
        </h2>
        <p className="mb-2 text-gray-300">
          Points will be calculated after the event and you will be placed on a
          leaderboard.
        </p>
      </div>

      <div className="rounded-lg bg-slate-700 p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          4. Win Rewards
        </h2>
        <p className="mb-2 text-gray-300">
          Top performers in each competition have a chance to win exciting
          rewards.
        </p>
        <p className="text-gray-300">
          Check the competition details for specific reward information.
        </p>
      </div>
    </div>
  );
}
