import ErrorMessage from "@/components/ErrorMessage";
import GamePlay from "@/components/GamePlay/GamePlay";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { gameSessionApi, handleApiError } from "@/services/api";
import { GameQuestion, GameSession, SubmitAnswerRequest } from "@/types/game";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

const GamePlayPage: React.FC = () => {
  const [session, setSession] = useState<GameSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(
    null
  );
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastAnswerResult, setLastAnswerResult] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
  } | null>(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [gameEnding, setGameEnding] = useState(false);
  const [waitingForNext, setWaitingForNext] = useState(false);

  const router = useRouter();
  const { sessionId } = router.query;

  const handleGameEnd = useCallback(
    async (reason?: string) => {
      try {
        if (!sessionId || gameEnding) return;

        setGameEnding(true);
        console.log("Game ending with reason:", reason);

        await gameSessionApi.complete(parseInt(sessionId as string));

        // Add a small delay to show completion message
        setTimeout(() => {
          router.push(
            `/game-result?sessionId=${sessionId}&reason=${
              reason || "completed"
            }`
          );
        }, 2000);
      } catch (err) {
        setError(handleApiError(err));
        setGameEnding(false);
      }
    },
    [sessionId, router, gameEnding]
  );

  const getNextQuestion = useCallback(
    async (id: number) => {
      try {
        console.log("Getting next question for session:", id);
        setQuestionLoading(true);
        setError(null);
        const question = await gameSessionApi.getNextQuestion(id);

        // Check if question is null (indicates game completion)
        if (question === null) {
          console.log(
            "Game completed - all numbers used, ending game silently"
          );
          await handleGameEnd("all_numbers_used");
          return;
        }

        console.log("Question received:", question);
        setCurrentQuestion(question);
      } catch (err: unknown) {
        console.error("Error getting next question:", err);
        const errorMessage = handleApiError(err);
        console.log("Error message:", errorMessage);

        // Check for specific error conditions that indicate game completion
        if (
          errorMessage.toLowerCase().includes("complete") ||
          errorMessage.toLowerCase().includes("finished") ||
          errorMessage.toLowerCase().includes("ended") ||
          errorMessage.toLowerCase().includes("expired") ||
          errorMessage.toLowerCase().includes("session not found") ||
          errorMessage.toLowerCase().includes("all numbers") ||
          errorMessage.toLowerCase().includes("no available numbers") ||
          errorMessage.toLowerCase().includes("not active")
        ) {
          console.log("Game should end due to:", errorMessage);
          await handleGameEnd("all_numbers_used");
        } else {
          console.log("Showing error instead of ending game:", errorMessage);
          setError(`Failed to get next question: ${errorMessage}`);
        }
      } finally {
        setQuestionLoading(false);
      }
    },
    [handleGameEnd]
  );

  const loadGameSession = useCallback(
    async (id: number) => {
      try {
        console.log("Loading game session:", id);
        setLoading(true);
        setError(null);
        const sessionData = await gameSessionApi.getById(id);
        console.log("Session loaded:", sessionData);
        setSession(sessionData);
        await getNextQuestion(id);
      } catch (err) {
        console.error("Error loading session:", err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    },
    [getNextQuestion]
  );

  const handleSubmitAnswer = async (request: SubmitAnswerRequest) => {
    try {
      console.log(
        `Submitting answer for number ${request.number}: ${request.answer}`
      );
      const result = await gameSessionApi.submitAnswer(request);

      setLastAnswerResult({
        isCorrect: result.isCorrect,
        correctAnswer: result.correctAnswer,
      });

      setScore({
        correct: result.correctAnswers,
        incorrect: result.incorrectAnswers,
      });

      // Calculate total answers given
      const totalAnswered = result.correctAnswers + result.incorrectAnswers;
      console.log(`Total questions answered: ${totalAnswered}`);

      // Set waiting state and clear current question to prevent showing duplicates
      setWaitingForNext(true);
      setCurrentQuestion(null);

      // Check if we should continue or end the game
      // Add delay to show the result, then check session status before getting next question
      setTimeout(async () => {
        if (sessionId && !gameEnding) {
          try {
            // First check if the session is still active
            console.log("Checking session status before getting next question");
            const isActive = await gameSessionApi.checkStatus(
              parseInt(sessionId as string)
            );

            if (!isActive) {
              console.log("Session is no longer active, ending game");
              setWaitingForNext(false);
              await handleGameEnd("session_completed");
              return;
            }

            console.log(
              "Session still active, attempting to get next question"
            );
            await getNextQuestion(parseInt(sessionId as string));
          } catch {
            console.log(
              "Error checking session status, trying to get next question anyway"
            );
            await getNextQuestion(parseInt(sessionId as string));
          } finally {
            setWaitingForNext(false);
          }
        } else {
          setWaitingForNext(false);
        }
      }, 1500); // Increased delay to 1.5 seconds to give backend more time to process
    } catch (err: unknown) {
      console.error("Error submitting answer:", err);
      const errorMessage = handleApiError(err);

      // Check if the error indicates the game should end
      if (
        errorMessage.toLowerCase().includes("already answered") ||
        errorMessage.toLowerCase().includes("duplicate") ||
        errorMessage.toLowerCase().includes("completed") ||
        errorMessage.toLowerCase().includes("expired") ||
        errorMessage.toLowerCase().includes("not active")
      ) {
        console.log(
          "Game ending due to answer submission error:",
          errorMessage
        );
        await handleGameEnd("duplicate_or_completed");
      } else {
        setError(errorMessage);
      }
    }
  };

  useEffect(() => {
    if (sessionId) {
      loadGameSession(parseInt(sessionId as string));
    }
  }, [sessionId, loadGameSession]);

  const renderContent = () => {
    if (loading) return <LoadingSpinner message="Loading game session..." />;
    if (error)
      return (
        <div className="text-center">
          <ErrorMessage message={error} />
          {sessionId && !gameEnding && (
            <button
              onClick={() => {
                if (currentQuestion) {
                  getNextQuestion(parseInt(sessionId as string));
                } else {
                  loadGameSession(parseInt(sessionId as string));
                }
              }}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      );
    if (!session) return <ErrorMessage message="Game session not found" />;

    return (
      <GamePlay
        session={session}
        onSubmitAnswer={handleSubmitAnswer}
        onGameEnd={handleGameEnd}
        currentQuestion={waitingForNext ? null : currentQuestion}
        score={score}
        lastAnswerResult={lastAnswerResult}
        isLoadingQuestion={questionLoading || waitingForNext}
      />
    );
  };

  return (
    <Layout
      title="Playing Game - FizzBuzz Game"
      description="Play your FizzBuzz game"
      className="min-h-screen bg-gray-100"
    >
      <div className="flex justify-between items-center mb-8">
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
      {renderContent()}
    </Layout>
  );
};

export default GamePlayPage;
