import ErrorMessage from "@/components/ErrorMessage";
import GameTemplateList from "@/components/GameTemplateList";
import LoadingSpinner from "@/components/LoadingSpinner";
import { gameTemplateApi, handleApiError } from "@/services/api";
import { GameTemplate } from "@/types/game";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const HomePage: React.FC = () => {
  const [templates, setTemplates] = useState<GameTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadGameTemplates();
  }, []);

  const loadGameTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const templatesData = await gameTemplateApi.getAll();
      setTemplates(templatesData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: GameTemplate) => {
    setSelectedTemplate(template);
    router.push(`/game-setup?gameId=${template.id}`);
  };

  const renderContent = () => {
    if (loading) return <LoadingSpinner message="Loading games..." />;
    if (error)
      return <ErrorMessage message={error} onRetry={loadGameTemplates} />;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Choose a Game to Play
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/create-game">
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                Create New Game
              </button>
            </Link>
            <Link href="/manage-templates">
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                Manage Templates
              </button>
            </Link>
            <Link href="/history">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Game History
              </button>
            </Link>
            <Link href="/stats">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                Statistics
              </button>
            </Link>
          </div>
        </div>

        <GameTemplateList
          templates={templates}
          onSelectTemplate={handleSelectTemplate}
          selectedTemplateId={selectedTemplate?.id}
        />
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>FizzBuzz Game - Home</title>
        <meta
          name="description"
          content="Play customizable FizzBuzz games online"
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
              <nav className="flex space-x-4">
                <Link
                  href="/manage-templates"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Manage
                </Link>
                <Link
                  href="/history"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  History
                </Link>
                <Link
                  href="/stats"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Statistics
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>

        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500">
            <p>
              &copy; 2025 FizzBuzz Game. Create and play custom FizzBuzz
              variants!
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
