import { handleApiError } from "@/services/api";
import { gameHistoryApi } from "@/services/gameHistoryApi";
import { GameHistoryResponse, GameStatsResponse } from "@/types/gameHistory";
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
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 75) return "text-blue-600";
    if (accuracy >= 60) return "text-yellow-600";
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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Game Statistics
        </h1>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalGamesPlayed}
            </div>
            <div className="text-gray-600">Total Games Played</div>
          </div>
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.totalPlayersCount}
            </div>
            <div className="text-gray-600">Total Players</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.averageAccuracy.toFixed(1)}%
            </div>
            <div className="text-gray-600">Average Accuracy</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Players */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🏆 Top Players
            </h2>
            <div className="space-y-2">
              {topPlayers.length > 0 ? (
                topPlayers.map((player, index) => (
                  <div
                    key={player}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">
                        {getTrophyIcon(index)}
                      </div>
                      <div className="flex items-center">
                        {onViewPlayerProfile ? (
                          <button
                            onClick={() => onViewPlayerProfile(player)}
                            className="font-medium text-primary-600 hover:text-primary-800 underline"
                          >
                            {player}
                          </button>
                        ) : (
                          <span className="font-medium">{player}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No players yet
                </div>
              )}
            </div>
          </div>

          {/* Game Template Stats */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🎮 Popular Games
            </h2>
            <div className="space-y-3">
              {stats.gameTemplateStats.length > 0 ? (
                stats.gameTemplateStats.map((gameStats) => (
                  <div
                    key={gameStats.gameTemplateId}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">
                        {gameStats.gameName}
                      </h3>
                      <span className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded">
                        {gameStats.timesPlayed} plays
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Avg Accuracy:</span>
                        <span
                          className={`font-medium ml-1 ${getAccuracyColor(
                            gameStats.averageAccuracy
                          )}`}
                        >
                          {gameStats.averageAccuracy.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg Score:</span>
                        <span className="font-medium ml-1 text-blue-600">
                          {gameStats.averageScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    {/* Progress bar for popularity */}
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-blue-600 h-1 rounded-full"
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
                <div className="text-center text-gray-500 py-4">
                  No games played yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Most Popular Game Highlight */}
        {stats.mostPopularGame.gameName && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ⭐ Most Popular Game
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {stats.mostPopularGame.gameName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Times Played:</span>
                      <span className="font-bold ml-1 text-blue-600">
                        {stats.mostPopularGame.timesPlayed}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Average Accuracy:</span>
                      <span
                        className={`font-bold ml-1 ${getAccuracyColor(
                          stats.mostPopularGame.averageAccuracy
                        )}`}
                      >
                        {stats.mostPopularGame.averageAccuracy.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Average Score:</span>
                      <span className="font-bold ml-1 text-purple-600">
                        {stats.mostPopularGame.averageScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-6xl">🏆</div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🕐 Recent Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentGames.length > 0 ? (
              recentGames.map((game) => (
                <div
                  key={game.sessionId}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      {onViewPlayerProfile ? (
                        <button
                          onClick={() => onViewPlayerProfile(game.playerName)}
                          className="font-medium text-primary-600 hover:text-primary-800 underline"
                        >
                          {game.playerName}
                        </button>
                      ) : (
                        <span className="font-medium text-gray-800">
                          {game.playerName}
                        </span>
                      )}
                      <div className="text-sm text-gray-600">
                        {game.gameName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {formatDate(game.completedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Score:{" "}
                      <span className="font-medium">
                        {game.correctAnswers}/{game.totalQuestions}
                      </span>
                    </span>
                    <span
                      className={`font-medium ${getAccuracyColor(
                        game.accuracyPercentage
                      )}`}
                    >
                      {game.accuracyPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500 py-8">
                No recent activity
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Quick Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {stats.gameTemplateStats.length}
              </div>
              <div className="text-xs text-gray-600">Game Types</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {stats.gameTemplateStats.reduce(
                  (sum, game) => sum + game.timesPlayed,
                  0
                )}
              </div>
              <div className="text-xs text-gray-600">Total Plays</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {stats.gameTemplateStats.length > 0
                  ? (
                      stats.gameTemplateStats.reduce(
                        (sum, game) => sum + game.averageScore,
                        0
                      ) / stats.gameTemplateStats.length
                    ).toFixed(1)
                  : "0"}
              </div>
              <div className="text-xs text-gray-600">Avg Game Score</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">
                {topPlayers.length}
              </div>
              <div className="text-xs text-gray-600">Active Players</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
