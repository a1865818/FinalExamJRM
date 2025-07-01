import { handleApiError } from "@/services/api";
import { gameHistoryApi } from "@/services/gameHistoryApi";
import { GameHistoryResponse, GameStatsResponse } from "@/types/gameHistory";
import {
  BarChart3,
  Clock,
  Gamepad2,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ErrorMessage from "../ErrorMessage";
import LoadingSpinner from "../LoadingSpinner";

interface GameStatsProps {
  onViewPlayerProfile?: (playerName: string) => void;
}

const GameStats: React.FC<GameStatsProps> = ({ onViewPlayerProfile }) => {
  const [stats, setStats] = useState<GameStatsResponse | null>(null);
  const [topPlayers, setTopPlayers] = useState<string[]>([]);
  const [recentGames, setRecentGames] = useState<GameHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, playersData, recentData] = await Promise.all([
        gameHistoryApi.getGameStats(),
        gameHistoryApi.getTopPlayers(10),
        gameHistoryApi.getRecentGames(8),
      ]);
      setStats(statsData);
      setTopPlayers(playersData);
      setRecentGames(recentData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-emerald-600";
    if (accuracy >= 75) return "text-blue-600";
    if (accuracy >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getTrophyIcon = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return "🏅";
    }
  };

  if (loading) return <LoadingSpinner message="Loading statistics..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadStats} />;

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text gradient-primary">
          Game Statistics
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Discover insights, track performance, and see how you stack up against
          other players
        </p>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-elevated bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200/50">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalGamesPlayed.toLocaleString()}
              </div>
              <div className="text-blue-700 font-medium">
                Total Games Played
              </div>
            </div>
          </div>
        </div>

        <div className="card-elevated bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200/50">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600">
                {stats.totalPlayersCount.toLocaleString()}
              </div>
              <div className="text-emerald-700 font-medium">Active Players</div>
            </div>
          </div>
        </div>

        <div className="card-elevated bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200/50">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {stats.averageAccuracy.toFixed(1)}%
              </div>
              <div className="text-purple-700 font-medium">
                Average Accuracy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Players Leaderboard */}
        <div className="card-elevated">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Top Players
              </h2>
              <p className="text-sm text-slate-600">Hall of Fame</p>
            </div>
          </div>

          <div className="space-y-3">
            {topPlayers.length > 0 ? (
              topPlayers.map((player, index) => (
                <div
                  key={player}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    index < 3
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                        index === 0
                          ? "bg-yellow-500 text-white"
                          : index === 1
                          ? "bg-gray-400 text-white"
                          : index === 2
                          ? "bg-amber-600 text-white"
                          : "bg-slate-300 text-slate-700"
                      }`}
                    >
                      {index < 3 ? getTrophyIcon(index) : index + 1}
                    </div>
                    <div>
                      {onViewPlayerProfile ? (
                        <button
                          onClick={() => onViewPlayerProfile(player)}
                          className="font-semibold text-slate-800 hover:text-blue-600 transition-colors text-left"
                        >
                          {player}
                        </button>
                      ) : (
                        <span className="font-semibold text-slate-800">
                          {player}
                        </span>
                      )}
                      <div className="text-sm text-slate-600">
                        Rank #{index + 1}
                      </div>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="badge bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                      Champion
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-slate-500">No players yet</div>
                <p className="text-sm text-slate-400 mt-1">
                  Be the first to play!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Popular Games */}
        <div className="card-elevated">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Popular Games
              </h2>
              <p className="text-sm text-slate-600">Most played templates</p>
            </div>
          </div>

          <div className="space-y-4">
            {stats.gameTemplateStats.length > 0 ? (
              stats.gameTemplateStats.slice(0, 5).map((gameStats, index) => (
                <div
                  key={gameStats.gameTemplateId}
                  className="card bg-slate-50 group hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {gameStats.gameName}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="badge badge-info">
                        {gameStats.timesPlayed} plays
                      </span>
                      {index === 0 && (
                        <span className="badge bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                          🔥 Hot
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Avg Accuracy:</span>
                      <span
                        className={`font-semibold ${getAccuracyColor(
                          gameStats.averageAccuracy
                        )}`}
                      >
                        {gameStats.averageAccuracy.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Avg Score:</span>
                      <span className="font-semibold text-blue-600">
                        {gameStats.averageScore.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Popularity Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (gameStats.timesPlayed /
                              Math.max(
                                ...stats.gameTemplateStats.map(
                                  (g) => g.timesPlayed
                                )
                              )) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-slate-500">No games played yet</div>
                <p className="text-sm text-slate-400 mt-1">
                  Start playing to see statistics!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Most Popular Game Spotlight */}
      {stats.mostPopularGame.gameName && (
        <div className="card-elevated bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">👑</div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {stats.mostPopularGame.gameName}
                  </h3>
                  <p className="text-indigo-700 font-medium">
                    Most Popular Game
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.mostPopularGame.timesPlayed}
                  </div>
                  <div className="text-sm text-slate-600">Times Played</div>
                </div>
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <div
                    className={`text-2xl font-bold ${getAccuracyColor(
                      stats.mostPopularGame.averageAccuracy
                    )}`}
                  >
                    {stats.mostPopularGame.averageAccuracy.toFixed(1)}%
                  </div>
                  <div className="text-sm text-slate-600">Avg Accuracy</div>
                </div>
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.mostPopularGame.averageScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-600">Avg Score</div>
                </div>
              </div>
            </div>

            <div className="text-8xl lg:text-9xl opacity-20">🏆</div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="card-elevated">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Recent Activity
            </h2>
            <p className="text-sm text-slate-600">Latest game sessions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentGames.length > 0 ? (
            recentGames.map((game) => (
              <div
                key={game.sessionId}
                className="card bg-slate-50 group hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    {onViewPlayerProfile ? (
                      <button
                        onClick={() => onViewPlayerProfile(game.playerName)}
                        className="font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                      >
                        {game.playerName}
                      </button>
                    ) : (
                      <span className="font-semibold text-slate-800">
                        {game.playerName}
                      </span>
                    )}
                    <div className="text-sm text-slate-600">
                      {game.gameName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">
                      {formatDate(game.completedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Score:{" "}
                    <span className="font-semibold">
                      {game.correctAnswers}/{game.totalQuestions}
                    </span>
                  </span>
                  <span
                    className={`font-semibold ${getAccuracyColor(
                      game.accuracyPercentage
                    )}`}
                  >
                    {game.accuracyPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <div className="text-slate-500">No recent activity</div>
              <p className="text-sm text-slate-400 mt-1">
                Games will appear here as they&apos;re played
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Summary Stats */}
      <div className="card bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">
          Platform Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.gameTemplateStats.length}
            </div>
            <div className="text-sm text-slate-600">Game Templates</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.gameTemplateStats.reduce(
                (sum, game) => sum + game.timesPlayed,
                0
              )}
            </div>
            <div className="text-sm text-slate-600">Total Sessions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.gameTemplateStats.length > 0
                ? (
                    stats.gameTemplateStats.reduce(
                      (sum, game) => sum + game.averageScore,
                      0
                    ) / stats.gameTemplateStats.length
                  ).toFixed(1)
                : "0"}
            </div>
            <div className="text-sm text-slate-600">Platform Avg Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">
              {topPlayers.length}
            </div>
            <div className="text-sm text-slate-600">Leaderboard Players</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
