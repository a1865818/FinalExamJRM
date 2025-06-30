import GameStats from "@/components/GameStats/GameStats";
import PlayerProfile from "@/components/PlayerProfile";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";

const StatsPage: React.FC = () => {
  const [selectedPlayerName, setSelectedPlayerName] = useState<string | null>(
    null
  );

  const handleViewPlayerProfile = (playerName: string) => {
    setSelectedPlayerName(playerName);
  };

  return (
    <>
      <Head>
        <title>Statistics - FizzBuzz Game</title>
        <meta
          name="description"
          content="View game statistics and leaderboards"
        />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <Link href="/">
                <h1 className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-primary-600 transition-colors">
                  FizzBuzz Game
                </h1>
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/history"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  History
                </Link>
                <Link
                  href="/"
                  className="text-primary-600 hover:text-primary-800 transition-colors"
                >
                  ← Back to Games
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <GameStats onViewPlayerProfile={handleViewPlayerProfile} />
        </main>
      </div>

      {/* Player Profile Modal */}
      {selectedPlayerName && (
        <PlayerProfile
          playerName={selectedPlayerName}
          onClose={() => setSelectedPlayerName(null)}
        />
      )}
    </>
  );
};

export default StatsPage;
