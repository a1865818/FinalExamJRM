import { GameHistoryItem } from "@/types/gameHistory";
import {
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";
import React from "react";

interface GameSessionDetailsProps {
  game: GameHistoryItem;
}

const GameSessionDetails: React.FC<GameSessionDetailsProps> = ({ game }) => {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const getPerformanceIcon = (accuracy: number) => {
    if (accuracy >= 90) {
      return <CheckCircle className="w-6 h-6 text-emerald-500" />;
    }
    if (accuracy >= 70) {
      return <Target className="w-6 h-6 text-blue-500" />;
    }
    return <XCircle className="w-6 h-6 text-amber-500" />;
  };

  const getPerformanceMessage = (accuracy: number) => {
    if (accuracy >= 95) return "Outstanding performance! 🎉";
    if (accuracy >= 90) return "Excellent work! 👏";
    if (accuracy >= 80) return "Great job! 👍";
    if (accuracy >= 70) return "Good effort! 😊";
    if (accuracy >= 50) return "Keep practicing! 💪";
    return "Room for improvement! 📚";
  };

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
        <div className="flex items-center space-x-4 mb-4">
          {getPerformanceIcon(game.accuracyPercentage)}
          <div>
            <h4 className="text-lg font-semibold text-slate-800">
              Performance Summary
            </h4>
            <p className="text-blue-700">
              {getPerformanceMessage(game.accuracyPercentage)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {game.correctAnswers}
            </div>
            <div className="text-sm text-slate-600">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {game.incorrectAnswers}
            </div>
            <div className="text-sm text-slate-600">Incorrect</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {game.totalQuestions}
            </div>
            <div className="text-sm text-slate-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {game.accuracyPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-slate-600">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Session Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Game Details */}
        <div className="card bg-slate-50">
          <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Game Details
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Game Name:</span>
              <span className="font-medium text-slate-800">
                {game.gameName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Player:</span>
              <span className="font-medium text-slate-800">
                {game.playerName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Duration:</span>
              <span className="font-medium text-slate-800">
                {formatDuration(game.duration)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Score:</span>
              <span className="font-medium text-slate-800">
                {game.correctAnswers}/{game.totalQuestions}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card bg-slate-50">
          <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-emerald-600" />
            Session Timeline
          </h4>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-slate-800">
                  Game Started
                </div>
                <div className="text-sm text-slate-600">
                  {formatDateTime(game.startedAt)}
                </div>
              </div>
            </div>
            {game.completedAt && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-slate-800">
                    Game Completed
                  </div>
                  <div className="text-sm text-slate-600">
                    {formatDateTime(game.completedAt)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200/50">
        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-purple-600" />
          Achievements
        </h4>
        <div className="flex flex-wrap gap-2">
          {game.accuracyPercentage >= 100 && (
            <div className="badge bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
              🎯 Perfect Score
            </div>
          )}
          {game.accuracyPercentage >= 90 && (
            <div className="badge bg-gradient-to-r from-emerald-400 to-emerald-500 text-white">
              🏆 High Achiever
            </div>
          )}
          {game.totalQuestions >= 50 && (
            <div className="badge bg-gradient-to-r from-blue-400 to-blue-500 text-white">
              🎮 Marathon Player
            </div>
          )}
          {game.duration <= 60 && game.totalQuestions >= 10 && (
            <div className="badge bg-gradient-to-r from-purple-400 to-purple-500 text-white">
              ⚡ Speed Demon
            </div>
          )}
          {game.correctAnswers >= 25 && (
            <div className="badge bg-gradient-to-r from-pink-400 to-pink-500 text-white">
              ✨ Star Performer
            </div>
          )}
          {game.accuracyPercentage < 50 && (
            <div className="badge bg-gradient-to-r from-orange-400 to-orange-500 text-white">
              📚 Learning Journey
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSessionDetails;
