import { GameHistoryItem } from "@/types/gameHistory";
import React, { useState } from "react";
import GameSessionDetails from "./GameSessionDetails";
interface GameHistoryRowProps {
  game: GameHistoryItem;
  onViewPlayerProfile?: (playerName: string) => void;
  formatDate: (dateString: string) => string;
  formatDuration: (seconds: number) => string;
}

const GameHistoryRow: React.FC<GameHistoryRowProps> = ({
  game,
  onViewPlayerProfile,
  formatDate,
  formatDuration,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 75) return "text-blue-600";
    if (accuracy >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {onViewPlayerProfile ? (
              <button
                onClick={() => onViewPlayerProfile(game.playerName)}
                className="text-primary-600 hover:text-primary-900 underline"
              >
                {game.playerName}
              </button>
            ) : (
              game.playerName
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{game.gameName}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {game.correctAnswers}/{game.totalQuestions}
          </div>
          <div className="text-xs text-gray-500">
            {game.incorrectAnswers} incorrect
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`text-sm font-semibold ${getAccuracyColor(
              game.accuracyPercentage
            )}`}
          >
            {game.accuracyPercentage.toFixed(1)}%
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {formatDuration(game.duration)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {game.completedAt ? formatDate(game.completedAt) : "In Progress"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-primary-600 hover:text-primary-900 mr-3"
          >
            {showDetails ? "Hide" : "View"} Details
          </button>
        </td>
      </tr>

      {showDetails && (
        <tr>
          <td colSpan={7} className="px-6 py-4 bg-gray-50">
            <GameSessionDetails game={game} />
          </td>
        </tr>
      )}
    </>
  );
};
export default GameHistoryRow;
