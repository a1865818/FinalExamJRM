import ErrorMessage from "@/components/ErrorMessage";
import GameResult from "@/components/GamePlay/GameResult";
import LoadingSpinner from "@/components/LoadingSpinner";
import { gameSessionApi, handleApiError } from "@/services/api";
import { GameResult as GameResultType } from "@/types/game";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const GameResultPage: React.FC = () => {
  const [gameResult, setGameResult] = useState<GameResultType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { sessionId } = router.query;

  useEffect(() => {
    if (sessionId) {
      loadGameResult(parseInt(sessionId as string));
    }
  }, [sessionId]);

  const loadGameResult = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await gameSessionApi.complete(id);
      setGameResult(result);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAgain = () => {
    if (gameResult) {
      // Navigate back to setup with the same game using the template id
      router.push(`/game-setup?gameId=${gameResult.sessionId}`);
    }
  };

  const handleNewGame = () => {
    router.push("/");
  };

  const handleViewHistory = () => {
    router.push("/history");
  };

  const renderContent = () => {
    if (loading) return <LoadingSpinner message="Loading results..." />;
    if (error)
      return (
        <ErrorMessage
          message={error}
          onRetry={() =>
            sessionId && loadGameResult(parseInt(sessionId as string))
          }
        />
      );
    if (!gameResult) return <ErrorMessage message="Game result not found" />;

    return (
      <GameResult
        result={gameResult}
        onPlayAgain={handlePlayAgain}
        onNewGame={handleNewGame}
        onViewHistory={handleViewHistory}
      />
    );
  };

  return (
    <>
      <Head>
        <title>Game Results - FizzBuzz Game</title>
        <meta name="description" content="View your game results" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <Link href="/">
                <h1 className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-primary-600 transition-colors">
                  FizzBuzz Game
                </h1>
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/history"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View History
                </Link>
                <Link
                  href="/"
                  className="text-primary-600 hover:text-primary-800 transition-colors"
                >
                  New Game
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default GameResultPage;
