// import { GameHistoryItem } from "@/types/gameHistory";
// import React from "react";

// interface GameSessionDetailsProps {
//   game: GameHistoryItem;
// }

// const GameSessionDetails: React.FC<GameSessionDetailsProps> = ({ game }) => {
//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <h4 className="font-semibold text-gray-800 mb-2">Game Statistics:</h4>
//           <div className="text-sm text-gray-600 space-y-1">
//             <div>Correct Answers: {game.correctAnswers}</div>
//             <div>Incorrect Answers: {game.incorrectAnswers}</div>
//             <div>Total Questions: {game.totalQuestions}</div>
//             <div>Accuracy: {game.accuracyPercentage.toFixed(1)}%</div>
//           </div>
//         </div>

//         <div>
//           <h4 className="font-semibold text-gray-800 mb-2">Session Info:</h4>
//           <div className="text-sm text-gray-600 space-y-1">
//             <div>Started: {new Date(game.startedAt).toLocaleString()}</div>
//             {game.completedAt && (
//               <div>
//                 Completed: {new Date(game.completedAt).toLocaleString()}
//               </div>
//             )}
//             <div>
//               Duration: {Math.floor(game.duration / 60)}m {game.duration % 60}s
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default GameSessionDetails;

import { GameHistoryItem } from "@/types/gameHistory";
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
      return (
        <svg
          className="w-6 h-6 text-emerald-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    if (accuracy >= 70) {
      return (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-6 h-6 text-amber-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    );
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
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
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
            <svg
              className="w-5 h-5 mr-2 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
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
          <svg
            className="w-5 h-5 mr-2 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
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
