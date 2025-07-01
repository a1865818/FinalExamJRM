import GameStats from "@/components/GameStats/GameStats";
import Layout from "@/components/Layout";
import PlayerProfile from "@/components/PlayerProfile";
import { History } from "lucide-react";
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
