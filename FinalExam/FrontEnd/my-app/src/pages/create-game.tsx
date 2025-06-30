import CreateGameForm from "@/components/CreateGameForm";
import { gameTemplateApi, handleApiError } from "@/services/api";
import { CreateGameTemplateRequest } from "@/types/game";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

const CreateGamePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateGameTemplate = async (
    request: CreateGameTemplateRequest
  ) => {
    try {
      setLoading(true);
      setError(null);
      const newTemplate = await gameTemplateApi.create(request);
      router.push(`/game-setup?gameId=${newTemplate.id}`);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>Create New Game - FizzBuzz Game</title>
        <meta
          name="description"
          content="Create your own custom FizzBuzz game variant"
        />
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
              <Link
                href="/"
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                ← Back to Games
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <CreateGameForm
            onSubmit={handleCreateGameTemplate}
            onCancel={handleCancel}
            isSubmitting={loading}
          />
        </main>
      </div>
    </>
  );
};

export default CreateGamePage;
