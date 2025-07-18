import { GameSessionStats } from "@/types/game";
import { Activity, AlertTriangle, CheckCircle } from "lucide-react";
import React from "react";

interface GameProgressProps {
  stats: GameSessionStats | null;
  className?: string;
}

const GameProgress: React.FC<GameProgressProps> = ({
  stats,
  className = "",
}) => {
  if (!stats) {
    return (
      <div className={`card space-y-4 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-8 bg-slate-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage =
    stats.totalPossibleNumbers > 0
      ? (stats.numbersUsed / stats.totalPossibleNumbers) * 100
      : 0;

  const getProgressColor = () => {
    if (progressPercentage >= 80) return "from-red-500 to-red-600";
    if (progressPercentage >= 60) return "from-amber-500 to-orange-500";
    if (progressPercentage >= 30) return "from-blue-500 to-blue-600";
    return "from-emerald-500 to-emerald-600";
  };

  const getProgressText = () => {
    if (progressPercentage >= 90) return "Almost done!";
    if (progressPercentage >= 75) return "Great progress!";
    if (progressPercentage >= 50) return "Halfway there!";
    if (progressPercentage >= 25) return "Getting started!";
    return "Just beginning!";
  };

  return (
    <div className={`card space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Progress</h3>
          <p className="text-sm text-slate-600">{getProgressText()}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600 font-medium">Numbers Used</span>
          <span className="text-slate-800 font-semibold">
            {stats.numbersUsed} / {stats.totalPossibleNumbers}
          </span>
        </div>

        <div className="relative">
          <div className="progress-bar h-3">
            <div
              className={`progress-fill bg-gradient-to-r ${getProgressColor()} h-full relative`}
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Progress shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center border border-blue-200/50">
          <div className="text-xl font-bold text-blue-600">
            {stats.numbersUsed}
          </div>
          <div className="text-xs text-blue-700 font-medium">Used</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3 text-center border border-emerald-200/50">
          <div className="text-xl font-bold text-emerald-600">
            {stats.numbersRemaining}
          </div>
          <div className="text-xs text-emerald-700 font-medium">Remaining</div>
        </div>
      </div>

      {/* Warning Messages */}
      {stats.numbersRemaining <= 5 && stats.numbersRemaining > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 animate-pulse">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-amber-800 text-sm font-medium">
              Only {stats.numbersRemaining} numbers left!
            </p>
          </div>
        </div>
      )}

      {stats.isCompleted && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-emerald-800 text-sm font-medium">
              All numbers completed!
            </p>
          </div>
        </div>
      )}

      {/* Session Status */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Session Status</span>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                stats.isCompleted
                  ? "bg-emerald-500"
                  : "bg-blue-500 animate-pulse"
              }`}
            ></div>
            <span className="font-medium">
              {stats.isCompleted ? "Completed" : "Active"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameProgress;
