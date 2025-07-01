import GameStats from "@/components/GameStats/GameStats";
import Layout from "@/components/Layout";
import PlayerProfile from "@/components/PlayerProfile";
import { History, Play, TrendingUp, Trophy } from "lucide-react";
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
          <History className="w-5 h-5 mr-2" />
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
              <Play className="w-6 h-6 text-white" />
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
              <Trophy className="w-6 h-6 text-white" />
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
              <TrendingUp className="w-6 h-6 text-white" />
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
