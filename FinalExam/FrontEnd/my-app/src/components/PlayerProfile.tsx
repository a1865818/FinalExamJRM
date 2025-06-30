import { handleApiError } from "@/services/api";
import { gameHistoryApi } from "@/services/gameHistoryApi";
import { PlayerGameHistoryResponse } from "@/types/gameHistory";
import React, { useCallback, useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import LoadingSpinner from "./LoadingSpinner";

interface PlayerProfileProps {
  playerName: string;
  onClose: () => void;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({
  playerName,
  onClose,
}) => {
  const [playerHistory, setPlayerHistory] =
    useState<PlayerGameHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGames, setExpandedGames] = useState<Set<number>>(new Set());

  const loadPlayerHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const history = await gameHistoryApi.getPlayerProfile(playerName);
      setPlayerHistory(history);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [playerName]);

  useEffect(() => {
    loadPlayerHistory();
  }, [loadPlayerHistory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 75) return "text-blue-600";
    if (accuracy >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getBadgeForAccuracy = (accuracy: number) => {
    if (accuracy >= 95)
      return { text: "Master", color: "bg-purple-100 text-purple-800" };
    if (accuracy >= 90)
      return { text: "Expert", color: "bg-green-100 text-green-800" };
    if (accuracy >= 80)
      return { text: "Advanced", color: "bg-blue-100 text-blue-800" };
    if (accuracy >= 70)
      return { text: "Intermediate", color: "bg-yellow-100 text-yellow-800" };
    if (accuracy >= 50)
      return { text: "Beginner", color: "bg-orange-100 text-orange-800" };
    return { text: "Novice", color: "bg-red-100 text-red-800" };
  };

  const toggleGameExpansion = (sessionId: number) => {
    const newExpanded = new Set(expandedGames);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedGames(newExpanded);
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <LoadingSpinner message="Loading player profile..." />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <ErrorMessage message={error} onRetry={loadPlayerHistory} />
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    );

  if (!playerHistory) return null;

  const badge = getBadgeForAccuracy(playerHistory.overallAccuracy);
  const averageScore =
    playerHistory.totalGamesPlayed > 0
      ? Math.round(
          playerHistory.totalCorrectAnswers / playerHistory.totalGamesPlayed
        )
      : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {playerHistory.playerName}&apos;s Profile
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
              >
                {badge.text}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Player Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {playerHistory.totalGamesPlayed}
              </div>
              <div className="text-sm text-gray-600">Games Played</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div
                className={`text-2xl font-bold ${getAccuracyColor(
                  playerHistory.overallAccuracy
                )}`}
              >
                {playerHistory.overallAccuracy.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Overall Accuracy</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {playerHistory.totalCorrectAnswers}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {averageScore}
              </div>
              <div className="text-sm text-gray-600">Avg Score/Game</div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">First Game</div>
              <div className="font-semibold">
                {formatDate(playerHistory.firstGamePlayed)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Last Game</div>
              <div className="font-semibold">
                {formatDate(playerHistory.lastGamePlayed)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">
                Total Questions Answered
              </div>
              <div className="font-semibold">
                {playerHistory.totalCorrectAnswers +
                  playerHistory.totalIncorrectAnswers}
              </div>
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Performance Breakdown
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Correct Answers</span>
                <span className="text-sm font-medium text-green-600">
                  {playerHistory.totalCorrectAnswers}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${playerHistory.overallAccuracy}%`,
                  }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Incorrect Answers</span>
                <span className="text-sm font-medium text-red-600">
                  {playerHistory.totalIncorrectAnswers}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Games */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Games
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {playerHistory.gameHistory.slice(0, 15).map((game) => (
                <div
                  key={game.sessionId}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        {game.gameName}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>
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
                        <span>Duration: {formatDuration(game.duration)}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{formatDate(game.completedAt)}</div>
                      <div className="text-xs">
                        {new Date(game.completedAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick game rules preview */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {game.rules.map((rule, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {rule.divisor}→{rule.replacement}
                      </span>
                    ))}
                  </div>

                  {/* Expand/Collapse Button */}
                  <div className="mt-3 pt-3 border-t">
                    <button
                      onClick={() => toggleGameExpansion(game.sessionId)}
                      className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      <span>
                        {expandedGames.has(game.sessionId) ? "Hide" : "Show"}{" "}
                        Question Details
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          expandedGames.has(game.sessionId) ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Expanded Question Details */}
                  {expandedGames.has(game.sessionId) && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-3">
                        Question-by-Question Breakdown
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                        {game.answers.map((answer, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border-l-4 ${
                              answer.isCorrect
                                ? "bg-green-50 border-green-500"
                                : "bg-red-50 border-red-500"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-700">
                                Question: {answer.number}
                              </span>
                              <span
                                className={`text-sm font-medium ${
                                  answer.isCorrect
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {answer.isCorrect
                                  ? "✅ Correct"
                                  : "❌ Incorrect"}
                              </span>
                            </div>
                            <div className="text-sm space-y-1">
                              <div>
                                <span className="text-gray-600">
                                  Your answer:
                                </span>
                                <span className="ml-1 font-medium">
                                  &ldquo;{answer.playerAnswer}&rdquo;
                                </span>
                              </div>
                              {!answer.isCorrect && (
                                <div>
                                  <span className="text-gray-600">
                                    Correct answer:
                                  </span>
                                  <span className="ml-1 font-medium text-green-600">
                                    &ldquo;{answer.correctAnswer}&rdquo;
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick Summary */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600 font-medium">
                            ✅ Correct:{" "}
                            {game.answers.filter((a) => a.isCorrect).length}
                          </span>
                          <span className="text-red-600 font-medium">
                            ❌ Incorrect:{" "}
                            {game.answers.filter((a) => !a.isCorrect).length}
                          </span>
                          <span className="text-gray-600 font-medium">
                            Total: {game.answers.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {playerHistory.gameHistory.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No games played yet
                </div>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
