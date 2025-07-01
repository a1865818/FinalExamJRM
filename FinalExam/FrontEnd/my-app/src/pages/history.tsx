import GameHistory from "@/components/GameHistory/GameHistory";
import Layout from "@/components/Layout";
import PlayerProfile from "@/components/PlayerProfile";
import Link from "next/link";
import React, { useState } from "react";

const HistoryPage: React.FC = () => {
  const [selectedPlayerName, setSelectedPlayerName] = useState<string | null>(
    null
  );

  const handleViewPlayerProfile = (playerName: string) => {
    setSelectedPlayerName(playerName);
  };

  return (
    <Layout
      title="Game History - FizzBuzz Game"
      description="View your game history and player statistics. Track your progress and analyze your performance over time."
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100"
      showHero={true}
      heroTitle="Game History"
      heroDescription="Track your progress and review your gaming journey"
      heroActions={
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link href="/stats">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              View Statistics
            </button>
          </Link>
          <Link href="/">
            <button className="btn-secondary btn-lg px-8 py-4 text-lg">
              Play New Game
            </button>
          </Link>
        </div>
      }
    >
      <div className="animate-slide-up">
        <GameHistory onViewPlayerProfile={handleViewPlayerProfile} />
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

export default HistoryPage;
