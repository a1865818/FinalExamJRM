import { gameTemplateApi, handleApiError } from "@/services/api";
import { gameHistoryApi } from "@/services/gameHistoryApi";
import { GameTemplate } from "@/types/game";
import {
  GameHistoryRequest,
  PaginatedGameHistoryResponse,
} from "@/types/gameHistory";
import React, { useEffect, useState } from "react";
import ErrorMessage from "../ErrorMessage";
import LoadingSpinner from "../LoadingSpinner";
import GameHistoryRow from "./GameHistoryRow";
interface GameHistoryProps {
  onViewPlayerProfile?: (playerName: string) => void;
}

const GameHistory: React.FC<GameHistoryProps> = ({ onViewPlayerProfile }) => {
  const [gameHistory, setGameHistory] =
    useState<PaginatedGameHistoryResponse | null>(null);
  const [gameTemplates, setGameTemplates] = useState<GameTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<GameHistoryRequest>({
    page: 1,
    pageSize: 10,
    sortBy: "StartedAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    loadGameTemplates();
    loadGameHistory();
  }, [filters]);

  const loadGameTemplates = async () => {
    try {
      const templates = await gameTemplateApi.getAll();
      setGameTemplates(templates);
    } catch (err) {
      console.error("Failed to load game templates:", err);
    }
  };

  const loadGameHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const history = await gameHistoryApi.getGameHistory(filters);
      setGameHistory(history);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<GameHistoryRequest>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) return <LoadingSpinner message="Loading game history..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadGameHistory} />;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Game History</h1>

        {/* Filters */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Player Name
              </label>
              <input
                type="text"
                value={filters.playerName || ""}
                onChange={(e) =>
                  handleFilterChange({
                    playerName: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Search by player name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Game Type
              </label>
              <select
                value={filters.gameTemplateId || ""}
                onChange={(e) =>
                  handleFilterChange({
                    gameTemplateId: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Games</option>
                {gameTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="StartedAt">Date Played</option>
                <option value="AccuracyPercentage">Accuracy</option>
                <option value="Duration">Duration</option>
                <option value="PlayerName">Player Name</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange({ sortOrder: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Game History Table */}
        {gameHistory && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {gameHistory.games.length} of {gameHistory.totalCount}{" "}
              games
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Game
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gameHistory.games.map((game) => (
                    <GameHistoryRow
                      key={game.sessionId}
                      game={game}
                      onViewPlayerProfile={onViewPlayerProfile}
                      formatDate={formatDate}
                      formatDuration={formatDuration}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {gameHistory.page} of {gameHistory.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(gameHistory.page - 1)}
                  disabled={!gameHistory.hasPreviousPage}
                  className="px-3 py-2 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(gameHistory.page + 1)}
                  disabled={!gameHistory.hasNextPage}
                  className="px-3 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default GameHistory;
