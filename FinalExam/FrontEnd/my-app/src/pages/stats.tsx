import GameStats from "@/components/GameStats/GameStats";
import Layout from "@/components/Layout";
import PlayerProfile from "@/components/PlayerProfile";
import Link from "next/link";
import React, { useState } from "react";

const StatsPage: React.FC = () => {
  const [selectedPlayerName, setSelectedPlayerName] = useState<string | null>(
    null
  );

  const handleViewPlayerProfile = (playerName: string) => {
    setSelectedPlayerName(playerName);
  };

  const heroActions = (
    <>
      <Link href="/history">
        <button className="btn-primary btn-lg px-8 py-4 text-lg font-semibold">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          View History
        </button>
      </Link>
      <Link href="/">
        <button className="btn-secondary btn-lg px-8 py-4 text-lg">
          Start Playing
        </button>
      </Link>
    </>
  );

  return (
    <Layout
      title="Statistics - FizzBuzz Game"
      description="View comprehensive game statistics, leaderboards, and performance analytics. See how you compare with other players."
      showHero={true}
      heroTitle="Statistics"
      heroDescription="Discover insights, leaderboards, and performance analytics"
      heroActions={heroActions}
    >
      {/* Statistics Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
        <div className="card-interactive bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200/50">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M9 16h.01M12 16h.01M15 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Games Played</h3>
              <p className="text-sm text-slate-600">Track total sessions</p>
            </div>
          </div>
        </div>

        <div className="card-interactive bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200/50">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Leaderboards</h3>
              <p className="text-sm text-slate-600">Top player rankings</p>
            </div>
          </div>
        </div>

        <div className="card-interactive bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200/50">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Performance</h3>
              <p className="text-sm text-slate-600">Accuracy & trends</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Content */}
      <div className="animate-slide-up">
        <GameStats onViewPlayerProfile={handleViewPlayerProfile} />
      </div>

      {/* Player Profile Modal */}
      {selectedPlayerName && (
        <PlayerProfile
          playerName={selectedPlayerName}
          onClose={() => setSelectedPlayerName(null)}
        />
      )}
    </Layout>
  );
};

export default StatsPage;
