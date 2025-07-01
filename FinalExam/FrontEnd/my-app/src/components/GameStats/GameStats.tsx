// import { handleApiError } from "@/services/api";
// import { gameHistoryApi } from "@/services/gameHistoryApi";
// import { GameHistoryResponse, GameStatsResponse } from "@/types/gameHistory";
// import React, { useEffect, useState } from "react";
// import ErrorMessage from "../ErrorMessage";
// import LoadingSpinner from "../LoadingSpinner";

// interface GameStatsProps {
//   onViewPlayerProfile?: (playerName: string) => void;
// }

// const GameStats: React.FC<GameStatsProps> = ({ onViewPlayerProfile }) => {
//   const [stats, setStats] = useState<GameStatsResponse | null>(null);
//   const [topPlayers, setTopPlayers] = useState<string[]>([]);
//   const [recentGames, setRecentGames] = useState<GameHistoryResponse[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     loadStats();
//   }, []);

//   const loadStats = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const [statsData, playersData, recentData] = await Promise.all([
//         gameHistoryApi.getGameStats(),
//         gameHistoryApi.getTopPlayers(10),
//         gameHistoryApi.getRecentGames(8),
//       ]);
//       setStats(statsData);
//       setTopPlayers(playersData);
//       setRecentGames(recentData);
//     } catch (err) {
//       setError(handleApiError(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getAccuracyColor = (accuracy: number) => {
//     if (accuracy >= 90) return "text-green-600";
//     if (accuracy >= 75) return "text-blue-600";
//     if (accuracy >= 60) return "text-yellow-600";
//     return "text-red-600";
//   };

//   const getTrophyIcon = (index: number) => {
//     switch (index) {
//       case 0:
//         return "🥇";
//       case 1:
//         return "🥈";
//       case 2:
//         return "🥉";
//       default:
//         return "🏅";
//     }
//   };

//   if (loading) return <LoadingSpinner message="Loading statistics..." />;
//   if (error) return <ErrorMessage message={error} onRetry={loadStats} />;

//   if (!stats) return null;

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">
//           Game Statistics
//         </h1>

//         {/* Overall Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-blue-50 rounded-lg p-6 text-center">
//             <div className="text-3xl font-bold text-blue-600 mb-2">
//               {stats.totalGamesPlayed}
//             </div>
//             <div className="text-gray-600">Total Games Played</div>
//           </div>
//           <div className="bg-green-50 rounded-lg p-6 text-center">
//             <div className="text-3xl font-bold text-green-600 mb-2">
//               {stats.totalPlayersCount}
//             </div>
//             <div className="text-gray-600">Total Players</div>
//           </div>
//           <div className="bg-purple-50 rounded-lg p-6 text-center">
//             <div className="text-3xl font-bold text-purple-600 mb-2">
//               {stats.averageAccuracy.toFixed(1)}%
//             </div>
//             <div className="text-gray-600">Average Accuracy</div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Top Players */}
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               🏆 Top Players
//             </h2>
//             <div className="space-y-2">
//               {topPlayers.length > 0 ? (
//                 topPlayers.map((player, index) => (
//                   <div
//                     key={player}
//                     className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                   >
//                     <div className="flex items-center">
//                       <div className="text-2xl mr-3">
//                         {getTrophyIcon(index)}
//                       </div>
//                       <div className="flex items-center">
//                         {onViewPlayerProfile ? (
//                           <button
//                             onClick={() => onViewPlayerProfile(player)}
//                             className="font-medium text-primary-600 hover:text-primary-800 underline"
//                           >
//                             {player}
//                           </button>
//                         ) : (
//                           <span className="font-medium">{player}</span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center text-gray-500 py-4">
//                   No players yet
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Game Template Stats */}
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               🎮 Popular Games
//             </h2>
//             <div className="space-y-3">
//               {stats.gameTemplateStats.length > 0 ? (
//                 stats.gameTemplateStats.map((gameStats) => (
//                   <div
//                     key={gameStats.gameTemplateId}
//                     className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="flex justify-between items-center mb-2">
//                       <h3 className="font-medium text-gray-800">
//                         {gameStats.gameName}
//                       </h3>
//                       <span className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded">
//                         {gameStats.timesPlayed} plays
//                       </span>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <span className="text-gray-600">Avg Accuracy:</span>
//                         <span
//                           className={`font-medium ml-1 ${getAccuracyColor(
//                             gameStats.averageAccuracy
//                           )}`}
//                         >
//                           {gameStats.averageAccuracy.toFixed(1)}%
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600">Avg Score:</span>
//                         <span className="font-medium ml-1 text-blue-600">
//                           {gameStats.averageScore.toFixed(1)}
//                         </span>
//                       </div>
//                     </div>
//                     {/* Progress bar for popularity */}
//                     <div className="mt-2">
//                       <div className="w-full bg-gray-200 rounded-full h-1">
//                         <div
//                           className="bg-blue-600 h-1 rounded-full"
//                           style={{
//                             width: `${Math.min(
//                               (gameStats.timesPlayed /
//                                 Math.max(
//                                   ...stats.gameTemplateStats.map(
//                                     (g) => g.timesPlayed
//                                   )
//                                 )) *
//                                 100,
//                               100
//                             )}%`,
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center text-gray-500 py-4">
//                   No games played yet
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Most Popular Game Highlight */}
//         {stats.mostPopularGame.gameName && (
//           <div className="mt-8">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               ⭐ Most Popular Game
//             </h2>
//             <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-2xl font-bold text-gray-800 mb-2">
//                     {stats.mostPopularGame.gameName}
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                     <div>
//                       <span className="text-gray-600">Times Played:</span>
//                       <span className="font-bold ml-1 text-blue-600">
//                         {stats.mostPopularGame.timesPlayed}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">Average Accuracy:</span>
//                       <span
//                         className={`font-bold ml-1 ${getAccuracyColor(
//                           stats.mostPopularGame.averageAccuracy
//                         )}`}
//                       >
//                         {stats.mostPopularGame.averageAccuracy.toFixed(1)}%
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">Average Score:</span>
//                       <span className="font-bold ml-1 text-purple-600">
//                         {stats.mostPopularGame.averageScore.toFixed(1)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-6xl">🏆</div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Recent Activity */}
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             🕐 Recent Activity
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {recentGames.length > 0 ? (
//               recentGames.map((game) => (
//                 <div
//                   key={game.sessionId}
//                   className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       {onViewPlayerProfile ? (
//                         <button
//                           onClick={() => onViewPlayerProfile(game.playerName)}
//                           className="font-medium text-primary-600 hover:text-primary-800 underline"
//                         >
//                           {game.playerName}
//                         </button>
//                       ) : (
//                         <span className="font-medium text-gray-800">
//                           {game.playerName}
//                         </span>
//                       )}
//                       <div className="text-sm text-gray-600">
//                         {game.gameName}
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-xs text-gray-500">
//                         {formatDate(game.completedAt)}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-600">
//                       Score:{" "}
//                       <span className="font-medium">
//                         {game.correctAnswers}/{game.totalQuestions}
//                       </span>
//                     </span>
//                     <span
//                       className={`font-medium ${getAccuracyColor(
//                         game.accuracyPercentage
//                       )}`}
//                     >
//                       {game.accuracyPercentage.toFixed(1)}%
//                     </span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-2 text-center text-gray-500 py-8">
//                 No recent activity
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Quick Stats Summary */}
//         <div className="mt-8 bg-gray-50 rounded-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">
//             📊 Quick Summary
//           </h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
//             <div>
//               <div className="text-lg font-bold text-blue-600">
//                 {stats.gameTemplateStats.length}
//               </div>
//               <div className="text-xs text-gray-600">Game Types</div>
//             </div>
//             <div>
//               <div className="text-lg font-bold text-green-600">
//                 {stats.gameTemplateStats.reduce(
//                   (sum, game) => sum + game.timesPlayed,
//                   0
//                 )}
//               </div>
//               <div className="text-xs text-gray-600">Total Plays</div>
//             </div>
//             <div>
//               <div className="text-lg font-bold text-purple-600">
//                 {stats.gameTemplateStats.length > 0
//                   ? (
//                       stats.gameTemplateStats.reduce(
//                         (sum, game) => sum + game.averageScore,
//                         0
//                       ) / stats.gameTemplateStats.length
//                     ).toFixed(1)
//                   : "0"}
//               </div>
//               <div className="text-xs text-gray-600">Avg Game Score</div>
//             </div>
//             <div>
//               <div className="text-lg font-bold text-yellow-600">
//                 {topPlayers.length}
//               </div>
//               <div className="text-xs text-gray-600">Active Players</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GameStats;
import { handleApiError } from "@/services/api";
import { gameHistoryApi } from "@/services/gameHistoryApi";
import { GameHistoryResponse, GameStatsResponse } from "@/types/gameHistory";
import React, { useEffect, useState } from "react";
import ErrorMessage from "../ErrorMessage";
import LoadingSpinner from "../LoadingSpinner";

interface GameStatsProps {
  onViewPlayerProfile?: (playerName: string) => void;
}

const GameStats: React.FC<GameStatsProps> = ({ onViewPlayerProfile }) => {
  const [stats, setStats] = useState<GameStatsResponse | null>(null);
  const [topPlayers, setTopPlayers] = useState<string[]>([]);
  const [recentGames, setRecentGames] = useState<GameHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, playersData, recentData] = await Promise.all([
        gameHistoryApi.getGameStats(),
        gameHistoryApi.getTopPlayers(10),
        gameHistoryApi.getRecentGames(8),
      ]);
      setStats(statsData);
      setTopPlayers(playersData);
      setRecentGames(recentData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-emerald-600";
    if (accuracy >= 75) return "text-blue-600";
    if (accuracy >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getTrophyIcon = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return "🏅";
    }
  };

  if (loading) return <LoadingSpinner message="Loading statistics..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadStats} />;

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text gradient-primary">
          Game Statistics
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Discover insights, track performance, and see how you stack up against
          other players
        </p>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-elevated bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200/50">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M9 16h.01M12 16h.01M15 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalGamesPlayed.toLocaleString()}
              </div>
              <div className="text-blue-700 font-medium">
                Total Games Played
              </div>
            </div>
          </div>
        </div>

        <div className="card-elevated bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200/50">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600">
                {stats.totalPlayersCount.toLocaleString()}
              </div>
              <div className="text-emerald-700 font-medium">Active Players</div>
            </div>
          </div>
        </div>

        <div className="card-elevated bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200/50">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {stats.averageAccuracy.toFixed(1)}%
              </div>
              <div className="text-purple-700 font-medium">
                Average Accuracy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Players Leaderboard */}
        <div className="card-elevated">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
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
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Top Players
              </h2>
              <p className="text-sm text-slate-600">Hall of Fame</p>
            </div>
          </div>

          <div className="space-y-3">
            {topPlayers.length > 0 ? (
              topPlayers.map((player, index) => (
                <div
                  key={player}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    index < 3
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                        index === 0
                          ? "bg-yellow-500 text-white"
                          : index === 1
                          ? "bg-gray-400 text-white"
                          : index === 2
                          ? "bg-amber-600 text-white"
                          : "bg-slate-300 text-slate-700"
                      }`}
                    >
                      {index < 3 ? getTrophyIcon(index) : index + 1}
                    </div>
                    <div>
                      {onViewPlayerProfile ? (
                        <button
                          onClick={() => onViewPlayerProfile(player)}
                          className="font-semibold text-slate-800 hover:text-blue-600 transition-colors text-left"
                        >
                          {player}
                        </button>
                      ) : (
                        <span className="font-semibold text-slate-800">
                          {player}
                        </span>
                      )}
                      <div className="text-sm text-slate-600">
                        Rank #{index + 1}
                      </div>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="badge bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                      Champion
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-slate-500">No players yet</div>
                <p className="text-sm text-slate-400 mt-1">
                  Be the first to play!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Popular Games */}
        <div className="card-elevated">
          <div className="flex items-center space-x-3 mb-6">
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Popular Games
              </h2>
              <p className="text-sm text-slate-600">Most played templates</p>
            </div>
          </div>

          <div className="space-y-4">
            {stats.gameTemplateStats.length > 0 ? (
              stats.gameTemplateStats.slice(0, 5).map((gameStats, index) => (
                <div
                  key={gameStats.gameTemplateId}
                  className="card bg-slate-50 group hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {gameStats.gameName}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="badge badge-info">
                        {gameStats.timesPlayed} plays
                      </span>
                      {index === 0 && (
                        <span className="badge bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                          🔥 Hot
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Avg Accuracy:</span>
                      <span
                        className={`font-semibold ${getAccuracyColor(
                          gameStats.averageAccuracy
                        )}`}
                      >
                        {gameStats.averageAccuracy.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Avg Score:</span>
                      <span className="font-semibold text-blue-600">
                        {gameStats.averageScore.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Popularity Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (gameStats.timesPlayed /
                              Math.max(
                                ...stats.gameTemplateStats.map(
                                  (g) => g.timesPlayed
                                )
                              )) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-slate-500">No games played yet</div>
                <p className="text-sm text-slate-400 mt-1">
                  Start playing to see statistics!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Most Popular Game Spotlight */}
      {stats.mostPopularGame.gameName && (
        <div className="card-elevated bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">👑</div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {stats.mostPopularGame.gameName}
                  </h3>
                  <p className="text-indigo-700 font-medium">
                    Most Popular Game
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.mostPopularGame.timesPlayed}
                  </div>
                  <div className="text-sm text-slate-600">Times Played</div>
                </div>
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <div
                    className={`text-2xl font-bold ${getAccuracyColor(
                      stats.mostPopularGame.averageAccuracy
                    )}`}
                  >
                    {stats.mostPopularGame.averageAccuracy.toFixed(1)}%
                  </div>
                  <div className="text-sm text-slate-600">Avg Accuracy</div>
                </div>
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.mostPopularGame.averageScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-600">Avg Score</div>
                </div>
              </div>
            </div>

            <div className="text-8xl lg:text-9xl opacity-20">🏆</div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="card-elevated">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Recent Activity
            </h2>
            <p className="text-sm text-slate-600">Latest game sessions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentGames.length > 0 ? (
            recentGames.map((game) => (
              <div
                key={game.sessionId}
                className="card bg-slate-50 group hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    {onViewPlayerProfile ? (
                      <button
                        onClick={() => onViewPlayerProfile(game.playerName)}
                        className="font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                      >
                        {game.playerName}
                      </button>
                    ) : (
                      <span className="font-semibold text-slate-800">
                        {game.playerName}
                      </span>
                    )}
                    <div className="text-sm text-slate-600">
                      {game.gameName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">
                      {formatDate(game.completedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Score:{" "}
                    <span className="font-semibold">
                      {game.correctAnswers}/{game.totalQuestions}
                    </span>
                  </span>
                  <span
                    className={`font-semibold ${getAccuracyColor(
                      game.accuracyPercentage
                    )}`}
                  >
                    {game.accuracyPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <div className="text-slate-500">No recent activity</div>
              <p className="text-sm text-slate-400 mt-1">
                Games will appear here as they&apos;re played
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Summary Stats */}
      <div className="card bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">
          Platform Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.gameTemplateStats.length}
            </div>
            <div className="text-sm text-slate-600">Game Templates</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.gameTemplateStats.reduce(
                (sum, game) => sum + game.timesPlayed,
                0
              )}
            </div>
            <div className="text-sm text-slate-600">Total Sessions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.gameTemplateStats.length > 0
                ? (
                    stats.gameTemplateStats.reduce(
                      (sum, game) => sum + game.averageScore,
                      0
                    ) / stats.gameTemplateStats.length
                  ).toFixed(1)
                : "0"}
            </div>
            <div className="text-sm text-slate-600">Platform Avg Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">
              {topPlayers.length}
            </div>
            <div className="text-sm text-slate-600">Leaderboard Players</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
