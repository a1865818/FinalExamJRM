import { GameHistoryItem } from "@/types/gameHistory";
import { ChevronDown } from "lucide-react";
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
    if (accuracy >= 90) return "text-emerald-600 bg-emerald-100";
    if (accuracy >= 75) return "text-blue-600 bg-blue-100";
    if (accuracy >= 60) return "text-amber-600 bg-amber-100";
    return "text-red-600 bg-red-100";
  };

  const getPerformanceBadge = (accuracy: number) => {
    if (accuracy >= 95) return { text: "Master", color: "bg-purple-500" };
    if (accuracy >= 90) return { text: "Expert", color: "bg-emerald-500" };
    if (accuracy >= 80) return { text: "Advanced", color: "bg-blue-500" };
    if (accuracy >= 70) return { text: "Good", color: "bg-amber-500" };
    return { text: "Learning", color: "bg-slate-500" };
  };

  const badge = getPerformanceBadge(game.accuracyPercentage);

  return (
    <div className="card-interactive group">
      {/* Main Game Card */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-800 ">
                Game: {game.gameName}
              </h3>
              <div className="flex items-center space-x-2 ">
                {onViewPlayerProfile ? (
                  <button
                    onClick={() => onViewPlayerProfile(game.playerName)}
                    className=" font-medium group-hover:text-blue-600  hover:underline group-hover:underline transition-colors"
                  >
                    Player: {game.playerName}
                  </button>
                ) : (
                  <span className="text-slate-600 font-medium group-hover:text-blue-600 hover:underline group-hover:underline  transition-colors">
                    Player: {game.playerName}
                  </span>
                )}
                <span className="text-slate-400">•</span>
                <span className="text-sm text-slate-500">
                  {formatDate(game.completedAt || game.startedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Badge */}
          <div className="flex items-center space-x-3">
            <div
              className={`${badge.color} text-white px-3 py-1 rounded-full text-sm font-medium`}
            >
              {badge.text}
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="btn-ghost btn-sm flex items-center"
            >
              {showDetails ? "Hide" : "View"} Details
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform ${
                  showDetails ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-slate-800">
              {game.correctAnswers}/{game.totalQuestions}
            </div>
            <div className="text-xs text-slate-600">Score</div>
          </div>

          <div
            className={`rounded-xl p-3 text-center ${getAccuracyColor(
              game.accuracyPercentage
            )}`}
          >
            <div className="text-lg font-bold">
              {game.accuracyPercentage.toFixed(1)}%
            </div>
            <div className="text-xs opacity-75">Accuracy</div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-slate-800">
              {formatDuration(game.duration)}
            </div>
            <div className="text-xs text-slate-600">Duration</div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-red-500">
              {game.incorrectAnswers}
            </div>
            <div className="text-xs text-slate-600">Incorrect</div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span>Progress</span>
            <span>{game.correctAnswers} correct answers</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${game.accuracyPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="mt-6 pt-6 border-t border-slate-200 animate-slide-up">
          <GameSessionDetails game={game} />
        </div>
      )}
    </div>
  );
};

export default GameHistoryRow;
