import ErrorMessage from "@/components/ErrorMessage";
import GameResult from "@/components/GamePlay/GameResult";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { gameSessionApi, handleApiError } from "@/services/api";
import { GameResult as GameResultType } from "@/types/game";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const GameResultPage: React.FC = () => {
  const [gameResult, setGameResult] = useState<GameResultType | null>(null);
  const [templateId, setTemplateId] = useState<number | null>(null);
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

      // First get the session to extract the template ID
      const session = await gameSessionApi.getById(id);
      setTemplateId(session.gameTemplateId);

      // Then get the result
      const result = await gameSessionApi.complete(id);
      setGameResult(result);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAgain = () => {
    if (templateId) {
      // Navigate back to setup with the same game using the template id
      router.push(`/game-setup?gameId=${templateId}`);
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
    <Layout
      title="Game Results - FizzBuzz Game"
      description="View your game results"
      className="min-h-screen bg-gray-100"
    >
      {renderContent()}
    </Layout>
  );
};

export default GameResultPage;
