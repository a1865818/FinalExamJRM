// import { handleApiError } from "@/services/api";
// import { gameHistoryApi } from "@/services/gameHistoryApi";
// import { PlayerGameHistoryResponse } from "@/types/gameHistory";
// import React, { useCallback, useEffect, useState } from "react";
// import ErrorMessage from "./ErrorMessage";
// import LoadingSpinner from "./LoadingSpinner";

// interface PlayerProfileProps {
//   playerName: string;
//   onClose: () => void;
// }

// const PlayerProfile: React.FC<PlayerProfileProps> = ({
//   playerName,
//   onClose,
// }) => {
//   const [playerHistory, setPlayerHistory] =
//     useState<PlayerGameHistoryResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [expandedGames, setExpandedGames] = useState<Set<number>>(new Set());

//   const loadPlayerHistory = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const history = await gameHistoryApi.getPlayerProfile(playerName);
//       setPlayerHistory(history);
//     } catch (err) {
//       setError(handleApiError(err));
//     } finally {
//       setLoading(false);
//     }
//   }, [playerName]);

//   useEffect(() => {
//     loadPlayerHistory();
//   }, [loadPlayerHistory]);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const formatDuration = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const getAccuracyColor = (accuracy: number) => {
//     if (accuracy >= 90) return "text-green-600";
//     if (accuracy >= 75) return "text-blue-600";
//     if (accuracy >= 60) return "text-yellow-600";
//     return "text-red-600";
//   };

//   const getBadgeForAccuracy = (accuracy: number) => {
//     if (accuracy >= 95)
//       return { text: "Master", color: "bg-purple-100 text-purple-800" };
//     if (accuracy >= 90)
//       return { text: "Expert", color: "bg-green-100 text-green-800" };
//     if (accuracy >= 80)
//       return { text: "Advanced", color: "bg-blue-100 text-blue-800" };
//     if (accuracy >= 70)
//       return { text: "Intermediate", color: "bg-yellow-100 text-yellow-800" };
//     if (accuracy >= 50)
//       return { text: "Beginner", color: "bg-orange-100 text-orange-800" };
//     return { text: "Novice", color: "bg-red-100 text-red-800" };
//   };

//   const toggleGameExpansion = (sessionId: number) => {
//     const newExpanded = new Set(expandedGames);
//     if (newExpanded.has(sessionId)) {
//       newExpanded.delete(sessionId);
//     } else {
//       newExpanded.add(sessionId);
//     }
//     setExpandedGames(newExpanded);
//   };

//   if (loading)
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-8">
//           <LoadingSpinner message="Loading player profile..." />
//         </div>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-8 max-w-md">
//           <ErrorMessage message={error} onRetry={loadPlayerHistory} />
//           <button
//             onClick={onClose}
//             className="mt-4 w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );

//   if (!playerHistory) return null;

//   const badge = getBadgeForAccuracy(playerHistory.overallAccuracy);
//   const averageScore =
//     playerHistory.totalGamesPlayed > 0
//       ? Math.round(
//           playerHistory.totalCorrectAnswers / playerHistory.totalGamesPlayed
//         )
//       : 0;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center space-x-4">
//               <h2 className="text-2xl font-bold text-gray-800">
//                 {playerHistory.playerName}&apos;s Profile
//               </h2>
//               <span
//                 className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
//               >
//                 {badge.text}
//               </span>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 text-3xl font-bold w-8 h-8 flex items-center justify-center"
//             >
//               ×
//             </button>
//           </div>

//           {/* Player Stats Grid */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-blue-50 rounded-lg p-4 text-center">
//               <div className="text-2xl font-bold text-blue-600">
//                 {playerHistory.totalGamesPlayed}
//               </div>
//               <div className="text-sm text-gray-600">Games Played</div>
//             </div>
//             <div className="bg-green-50 rounded-lg p-4 text-center">
//               <div
//                 className={`text-2xl font-bold ${getAccuracyColor(
//                   playerHistory.overallAccuracy
//                 )}`}
//               >
//                 {playerHistory.overallAccuracy.toFixed(1)}%
//               </div>
//               <div className="text-sm text-gray-600">Overall Accuracy</div>
//             </div>
//             <div className="bg-purple-50 rounded-lg p-4 text-center">
//               <div className="text-2xl font-bold text-purple-600">
//                 {playerHistory.totalCorrectAnswers}
//               </div>
//               <div className="text-sm text-gray-600">Correct Answers</div>
//             </div>
//             <div className="bg-yellow-50 rounded-lg p-4 text-center">
//               <div className="text-2xl font-bold text-yellow-600">
//                 {averageScore}
//               </div>
//               <div className="text-sm text-gray-600">Avg Score/Game</div>
//             </div>
//           </div>

//           {/* Activity Summary */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="text-sm text-gray-600">First Game</div>
//               <div className="font-semibold">
//                 {formatDate(playerHistory.firstGamePlayed)}
//               </div>
//             </div>
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="text-sm text-gray-600">Last Game</div>
//               <div className="font-semibold">
//                 {formatDate(playerHistory.lastGamePlayed)}
//               </div>
//             </div>
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="text-sm text-gray-600">
//                 Total Questions Answered
//               </div>
//               <div className="font-semibold">
//                 {playerHistory.totalCorrectAnswers +
//                   playerHistory.totalIncorrectAnswers}
//               </div>
//             </div>
//           </div>

//           {/* Performance Breakdown */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">
//               Performance Breakdown
//             </h3>
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm text-gray-600">Correct Answers</span>
//                 <span className="text-sm font-medium text-green-600">
//                   {playerHistory.totalCorrectAnswers}
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
//                 <div
//                   className="bg-green-600 h-2 rounded-full"
//                   style={{
//                     width: `${playerHistory.overallAccuracy}%`,
//                   }}
//                 ></div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Incorrect Answers</span>
//                 <span className="text-sm font-medium text-red-600">
//                   {playerHistory.totalIncorrectAnswers}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Recent Games */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               Recent Games
//             </h3>
//             <div className="space-y-3 max-h-80 overflow-y-auto">
//               {playerHistory.gameHistory.slice(0, 15).map((game) => (
//                 <div
//                   key={game.sessionId}
//                   className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <div className="font-medium text-gray-900 mb-1">
//                         {game.gameName}
//                       </div>
//                       <div className="flex items-center space-x-4 text-sm text-gray-600">
//                         <span>
//                           Score:{" "}
//                           <span className="font-medium">
//                             {game.correctAnswers}/{game.totalQuestions}
//                           </span>
//                         </span>
//                         <span
//                           className={`font-medium ${getAccuracyColor(
//                             game.accuracyPercentage
//                           )}`}
//                         >
//                           {game.accuracyPercentage.toFixed(1)}%
//                         </span>
//                         <span>Duration: {formatDuration(game.duration)}</span>
//                       </div>
//                     </div>
//                     <div className="text-right text-sm text-gray-500">
//                       <div>{formatDate(game.completedAt)}</div>
//                       <div className="text-xs">
//                         {new Date(game.completedAt).toLocaleTimeString(
//                           "en-US",
//                           {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           }
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Quick game rules preview */}
//                   <div className="mt-2 flex flex-wrap gap-1">
//                     {game.rules.map((rule, index) => (
//                       <span
//                         key={index}
//                         className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
//                       >
//                         {rule.divisor}→{rule.replacement}
//                       </span>
//                     ))}
//                   </div>

//                   {/* Expand/Collapse Button */}
//                   <div className="mt-3 pt-3 border-t">
//                     <button
//                       onClick={() => toggleGameExpansion(game.sessionId)}
//                       className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-800 transition-colors"
//                     >
//                       <span>
//                         {expandedGames.has(game.sessionId) ? "Hide" : "Show"}{" "}
//                         Question Details
//                       </span>
//                       <svg
//                         className={`w-4 h-4 transition-transform ${
//                           expandedGames.has(game.sessionId) ? "rotate-180" : ""
//                         }`}
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 9l-7 7-7-7"
//                         />
//                       </svg>
//                     </button>
//                   </div>

//                   {/* Expanded Question Details */}
//                   {expandedGames.has(game.sessionId) && (
//                     <div className="mt-4 bg-gray-50 rounded-lg p-4">
//                       <h4 className="font-medium text-gray-800 mb-3">
//                         Question-by-Question Breakdown
//                       </h4>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
//                         {game.answers.map((answer, index) => (
//                           <div
//                             key={index}
//                             className={`p-3 rounded-lg border-l-4 ${
//                               answer.isCorrect
//                                 ? "bg-green-50 border-green-500"
//                                 : "bg-red-50 border-red-500"
//                             }`}
//                           >
//                             <div className="flex items-center justify-between mb-2">
//                               <span className="font-medium text-gray-700">
//                                 Question: {answer.number}
//                               </span>
//                               <span
//                                 className={`text-sm font-medium ${
//                                   answer.isCorrect
//                                     ? "text-green-600"
//                                     : "text-red-600"
//                                 }`}
//                               >
//                                 {answer.isCorrect
//                                   ? "✅ Correct"
//                                   : "❌ Incorrect"}
//                               </span>
//                             </div>
//                             <div className="text-sm space-y-1">
//                               <div>
//                                 <span className="text-gray-600">
//                                   Your answer:
//                                 </span>
//                                 <span className="ml-1 font-medium">
//                                   &ldquo;{answer.playerAnswer}&rdquo;
//                                 </span>
//                               </div>
//                               {!answer.isCorrect && (
//                                 <div>
//                                   <span className="text-gray-600">
//                                     Correct answer:
//                                   </span>
//                                   <span className="ml-1 font-medium text-green-600">
//                                     &ldquo;{answer.correctAnswer}&rdquo;
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* Quick Summary */}
//                       <div className="mt-4 pt-3 border-t border-gray-200">
//                         <div className="flex justify-between text-sm">
//                           <span className="text-green-600 font-medium">
//                             ✅ Correct:{" "}
//                             {game.answers.filter((a) => a.isCorrect).length}
//                           </span>
//                           <span className="text-red-600 font-medium">
//                             ❌ Incorrect:{" "}
//                             {game.answers.filter((a) => !a.isCorrect).length}
//                           </span>
//                           <span className="text-gray-600 font-medium">
//                             Total: {game.answers.length}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}

//               {playerHistory.gameHistory.length === 0 && (
//                 <div className="text-center text-gray-500 py-8">
//                   No games played yet
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Close Button */}
//           <div className="mt-6 pt-4 border-t">
//             <button
//               onClick={onClose}
//               className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors"
//             >
//               Close Profile
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlayerProfile;
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
    if (accuracy >= 90) return "text-emerald-600";
    if (accuracy >= 75) return "text-blue-600";
    if (accuracy >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getBadgeForAccuracy = (accuracy: number) => {
    if (accuracy >= 95)
      return {
        text: "Grandmaster",
        color: "bg-gradient-to-r from-purple-500 to-purple-600",
        icon: "👑",
      };
    if (accuracy >= 90)
      return {
        text: "Master",
        color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
        icon: "🏆",
      };
    if (accuracy >= 80)
      return {
        text: "Expert",
        color: "bg-gradient-to-r from-blue-500 to-blue-600",
        icon: "⭐",
      };
    if (accuracy >= 70)
      return {
        text: "Advanced",
        color: "bg-gradient-to-r from-amber-500 to-amber-600",
        icon: "🎯",
      };
    if (accuracy >= 50)
      return {
        text: "Intermediate",
        color: "bg-gradient-to-r from-orange-500 to-orange-600",
        icon: "📈",
      };
    return {
      text: "Beginner",
      color: "bg-gradient-to-r from-slate-500 to-slate-600",
      icon: "🌱",
    };
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

  const getAchievements = () => {
    if (!playerHistory) return [];

    const achievements = [];
    const { totalGamesPlayed, overallAccuracy, totalCorrectAnswers } =
      playerHistory;

    if (totalGamesPlayed >= 50)
      achievements.push({
        text: "Marathon Player",
        icon: "🏃‍♂️",
        color: "bg-blue-500",
      });
    if (totalGamesPlayed >= 100)
      achievements.push({
        text: "Century Club",
        icon: "💯",
        color: "bg-purple-500",
      });
    if (overallAccuracy >= 95)
      achievements.push({
        text: "Perfectionist",
        icon: "🎯",
        color: "bg-emerald-500",
      });
    if (totalCorrectAnswers >= 500)
      achievements.push({
        text: "Answer Machine",
        icon: "🤖",
        color: "bg-amber-500",
      });
    if (playerHistory.gameHistory.some((g) => g.accuracyPercentage === 100)) {
      achievements.push({
        text: "Perfect Game",
        icon: "⭐",
        color: "bg-yellow-500",
      });
    }

    return achievements;
  };

  if (loading)
    return (
      <div className="modal-overlay animate-fade-in">
        <div className="modal-content max-w-md animate-scale-in">
          <div className="p-8">
            <LoadingSpinner message="Loading player profile..." />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="modal-overlay animate-fade-in">
        <div className="modal-content max-w-md animate-scale-in">
          <div className="p-8">
            <ErrorMessage message={error} onRetry={loadPlayerHistory} />
            <button onClick={onClose} className="mt-4 w-full btn-secondary">
              Close
            </button>
          </div>
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
  const achievements = getAchievements();

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content animate-scale-in">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
                {playerHistory.playerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {playerHistory.playerName}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <div
                    className={`${badge.color} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1`}
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.text}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card bg-blue-50 border-blue-200 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {playerHistory.totalGamesPlayed}
              </div>
              <div className="text-sm text-blue-700">Games Played</div>
            </div>
            <div className="card bg-emerald-50 border-emerald-200 text-center">
              <div
                className={`text-2xl font-bold ${getAccuracyColor(
                  playerHistory.overallAccuracy
                )}`}
              >
                {playerHistory.overallAccuracy.toFixed(1)}%
              </div>
              <div className="text-sm text-emerald-700">Accuracy</div>
            </div>
            <div className="card bg-purple-50 border-purple-200 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {playerHistory.totalCorrectAnswers}
              </div>
              <div className="text-sm text-purple-700">Correct Answers</div>
            </div>
            <div className="card bg-amber-50 border-amber-200 text-center">
              <div className="text-2xl font-bold text-amber-600">
                {averageScore}
              </div>
              <div className="text-sm text-amber-700">Avg Score/Game</div>
            </div>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <span className="text-xl mr-2">🏅</span>
                Achievements
              </h3>
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`${achievement.color} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1`}
                  >
                    <span>{achievement.icon}</span>
                    <span>{achievement.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-slate-50">
              <div className="text-sm text-slate-600">First Game</div>
              <div className="font-semibold text-slate-800">
                {formatDate(playerHistory.firstGamePlayed)}
              </div>
            </div>
            <div className="card bg-slate-50">
              <div className="text-sm text-slate-600">Last Game</div>
              <div className="font-semibold text-slate-800">
                {formatDate(playerHistory.lastGamePlayed)}
              </div>
            </div>
            <div className="card bg-slate-50">
              <div className="text-sm text-slate-600">Total Questions</div>
              <div className="font-semibold text-slate-800">
                {playerHistory.totalCorrectAnswers +
                  playerHistory.totalIncorrectAnswers}
              </div>
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="card bg-slate-50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Performance Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Correct Answers</span>
                <span className="font-medium text-emerald-600">
                  {playerHistory.totalCorrectAnswers}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${playerHistory.overallAccuracy}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Incorrect Answers</span>
                <span className="font-medium text-red-500">
                  {playerHistory.totalIncorrectAnswers}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Games */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Recent Games ({Math.min(playerHistory.gameHistory.length, 10)})
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
              {playerHistory.gameHistory.slice(0, 10).map((game) => (
                <div key={game.sessionId} className="card-interactive">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium text-slate-800">
                        {game.gameName}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span>
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
                        <span>{formatDuration(game.duration)}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-slate-500">
                        {formatDate(game.completedAt)}
                      </div>
                      <button
                        onClick={() => toggleGameExpansion(game.sessionId)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1 mt-1"
                      >
                        <span>
                          {expandedGames.has(game.sessionId) ? "Hide" : "Show"}{" "}
                          Details
                        </span>
                        <svg
                          className={`w-3 h-3 transition-transform ${
                            expandedGames.has(game.sessionId)
                              ? "rotate-180"
                              : ""
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
                  </div>

                  {/* Game Rules Preview */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {game.rules.slice(0, 4).map((rule, index) => (
                      <span key={index} className="rule-chip text-xs">
                        {rule.divisor}→{rule.replacement}
                      </span>
                    ))}
                    {game.rules.length > 4 && (
                      <span className="rule-chip text-xs bg-slate-200 text-slate-600">
                        +{game.rules.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {expandedGames.has(game.sessionId) && (
                    <div className="mt-4 pt-4 border-t border-slate-200 animate-slide-up">
                      <h4 className="font-medium text-slate-800 mb-3">
                        Question Breakdown
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                        {game.answers.slice(0, 20).map((answer, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded-lg text-xs border-l-4 ${
                              answer.isCorrect
                                ? "bg-emerald-50 border-emerald-500"
                                : "bg-red-50 border-red-500"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">
                                {answer.number}
                              </span>
                              <span
                                className={
                                  answer.isCorrect
                                    ? "text-emerald-600"
                                    : "text-red-600"
                                }
                              >
                                {answer.isCorrect ? "✓" : "✗"}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div>
                                Your:{" "}
                                <span className="font-medium">
                                  &quot;{answer.playerAnswer}&quot;
                                </span>
                              </div>
                              {!answer.isCorrect && (
                                <div>
                                  Correct:{" "}
                                  <span className="font-medium text-emerald-600">
                                    &quot;{answer.correctAnswer}&quot;
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {game.answers.length > 20 && (
                        <div className="text-xs text-slate-500 mt-2 text-center">
                          Showing first 20 of {game.answers.length} questions
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {playerHistory.gameHistory.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No games played yet
                </div>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-4 border-t border-slate-200">
            <button onClick={onClose} className="w-full btn-primary">
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
