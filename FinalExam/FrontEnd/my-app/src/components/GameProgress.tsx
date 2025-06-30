import { GameSessionStats } from "@/types/game";
import React from "react";

interface GameProgressProps {
  stats: GameSessionStats | null;
  className?: string;
}

const GameProgress: React.FC<GameProgressProps> = ({
  stats,
  className = "",
}) => {
  if (!stats) return null;

  const progressPercentage =
    (stats.numbersUsed / stats.totalPossibleNumbers) * 100;
  //   const remainingPercentage = 100 - progressPercentage;

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Game Progress
      </h3>

      <div className="space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Numbers Used</span>
            <span>
              {stats.numbersUsed} / {stats.totalPossibleNumbers}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-2">
            <div className="text-lg font-bold text-blue-600">
              {stats.numbersUsed}
            </div>
            <div className="text-xs text-gray-600">Used</div>
          </div>
          <div className="bg-green-50 rounded-lg p-2">
            <div className="text-lg font-bold text-green-600">
              {stats.numbersRemaining}
            </div>
            <div className="text-xs text-gray-600">Remaining</div>
          </div>
        </div>

        {/* Warning if running low */}
        {stats.numbersRemaining <= 5 && stats.numbersRemaining > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <p className="text-yellow-800 text-sm">
              ⚠️ Only {stats.numbersRemaining} numbers left!
            </p>
          </div>
        )}

        {/* Used Numbers Preview */}
        {stats.usedNumbers.length > 0 && (
          <div>
            <div className="text-sm text-gray-600 mb-1">Recently Used:</div>
            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
              {stats.usedNumbers.slice(-15).map((num) => (
                <span
                  key={num}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {num}
                </span>
              ))}
              {stats.usedNumbers.length > 15 && (
                <span className="text-xs text-gray-500">
                  +{stats.usedNumbers.length - 15} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameProgress;
