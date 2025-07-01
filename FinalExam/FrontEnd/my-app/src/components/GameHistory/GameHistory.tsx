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

  // Separate state for form inputs and actual filters
  const [searchForm, setSearchForm] = useState({
    playerName: "",
    gameTemplateId: "",
    sortBy: "StartedAt",
    sortOrder: "desc",
  });

  const [filters, setFilters] = useState<GameHistoryRequest>({
    page: 1,
    pageSize: 6,
    sortBy: "StartedAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    loadGameTemplates();
  }, []);

  useEffect(() => {
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

  const handleApplyFilters = () => {
    const newFilters: GameHistoryRequest = {
      page: 1,
      pageSize: 6,
      sortBy: searchForm.sortBy,
      sortOrder: searchForm.sortOrder,
      ...(searchForm.playerName.trim() && {
        playerName: searchForm.playerName.trim(),
      }),
      ...(searchForm.gameTemplateId && {
        gameTemplateId: parseInt(searchForm.gameTemplateId),
      }),
    };
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleFormChange = (field: string, value: string) => {
    setSearchForm((prev) => ({ ...prev, [field]: value }));
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

  const clearFilters = () => {
    const resetForm = {
      playerName: "",
      gameTemplateId: "",
      sortBy: "StartedAt",
      sortOrder: "desc",
    };
    setSearchForm(resetForm);
    setFilters({
      page: 1,
      pageSize: 6,
      sortBy: "StartedAt",
      sortOrder: "desc",
    });
  };

  const hasActiveFilters = filters.playerName || filters.gameTemplateId;

  // Handle Enter key press for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplyFilters();
    }
  };

  if (loading) return <LoadingSpinner message="Loading game history..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadGameHistory} />;

  return (
    <div className="space-y-8">
      {/* Filters Card */}
      <div className="card-elevated mt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Search & Filter
              </h3>
              <p className="text-sm text-slate-600">
                Find specific games and players
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-ghost btn-sm flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear Filters
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Search Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Player Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchForm.playerName}
                  onChange={(e) =>
                    handleFormChange("playerName", e.target.value)
                  }
                  onKeyPress={handleKeyPress}
                  className="input-field pr-10"
                  placeholder="Search by player name..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Game Type
              </label>
              <select
                value={searchForm.gameTemplateId}
                onChange={(e) =>
                  handleFormChange("gameTemplateId", e.target.value)
                }
                className="input-field"
              >
                <option value="">All Games</option>
                {gameTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Controls Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Sort By
              </label>
              <select
                value={searchForm.sortBy}
                onChange={(e) => handleFormChange("sortBy", e.target.value)}
                className="input-field"
              >
                <option value="StartedAt">Date Played</option>
                <option value="AccuracyPercentage">Accuracy</option>
                <option value="Duration">Duration</option>
                <option value="PlayerName">Player Name</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Order
              </label>
              <select
                value={searchForm.sortOrder}
                onChange={(e) => handleFormChange("sortOrder", e.target.value)}
                className="input-field"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={handleApplyFilters}
              className="btn-primary flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-secondary flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Filters
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-sm text-slate-600">Active filters:</span>
              {filters.playerName && (
                <span className="badge bg-blue-100 text-blue-800">
                  Player: {filters.playerName}
                </span>
              )}
              {filters.gameTemplateId && (
                <span className="badge bg-purple-100 text-purple-800">
                  Game:{" "}
                  {
                    gameTemplates.find((t) => t.id === filters.gameTemplateId)
                      ?.name
                  }
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {gameHistory && (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {gameHistory.totalCount} total games
              </div>
              <div className="text-sm text-slate-600">
                Showing {gameHistory.games.length} results
              </div>
            </div>

            <div className="text-sm text-slate-500">
              Page {gameHistory.page} of {gameHistory.totalPages}
            </div>
          </div>

          {/* Games Grid */}
          {gameHistory.games.length > 0 ? (
            <div className="grid gap-6">
              {gameHistory.games.map((game) => (
                <GameHistoryRow
                  key={game.sessionId}
                  game={game}
                  onViewPlayerProfile={onViewPlayerProfile}
                  formatDate={formatDate}
                  formatDuration={formatDuration}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No Games Found
              </h3>
              <p className="text-slate-500 mb-6">
                {hasActiveFilters
                  ? "Try adjusting your search criteria to see more results"
                  : "No games have been played yet"}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn-primary">
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {gameHistory.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(gameHistory.page - 1)}
                disabled={!gameHistory.hasPreviousPage}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from(
                  { length: Math.min(5, gameHistory.totalPages) },
                  (_, i) => {
                    const pageNum = gameHistory.page - 2 + i;
                    if (pageNum < 1 || pageNum > gameHistory.totalPages)
                      return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          pageNum === gameHistory.page
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() => handlePageChange(gameHistory.page + 1)}
                disabled={!gameHistory.hasNextPage}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameHistory;
