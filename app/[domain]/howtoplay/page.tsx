import UserSettings from "@/components/settings/userSettings";

export default async function SettingsPage() {
  // explain how to play with beautiful layouy
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-white">How to Play</h1>

      <div className="mb-8 rounded-lg bg-slate-700 p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          1. Join a Competition
        </h2>
        <p className="mb-2 text-gray-300">
          Browse our active competitions and choose one that interests you.
        </p>
        <p className="text-gray-300">
          Click on the "Join" button to participate in the selected competition.
        </p>
      </div>

      <div className="mb-8 rounded-lg bg-slate-700 p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          2. Answer Questions
        </h2>
        <p className="mb-2 text-gray-300">
          Each competition consists of multiple-choice questions related to the
          topic.
        </p>
        <p className="text-gray-300">
          Read each question carefully and select the answer you believe is
          correct.
        </p>
      </div>

      <div className="mb-8 rounded-lg bg-slate-700 p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          3. Earn Points
        </h2>
        <p className="mb-2 text-gray-300">
          Correct answers earn you points. The faster you answer, the more
          points you get!
        </p>
        <p className="text-gray-300">
          Keep an eye on the leaderboard to see how you rank against other
          players.
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
