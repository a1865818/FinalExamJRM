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
      <div className="space-y-12">
        {/* Action Cards Section */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text gradient-primary leading-tight">
              Ready to Play?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Choose from our collection of FizzBuzz games or create your own
              custom variant
            </p>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Link href="/create-game" className="group">
              <div className="card-interactive bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200/50 group-hover:from-blue-100 group-hover:to-indigo-200">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                      Create Game
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Design your own variant
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/manage-templates" className="group">
              <div className="card-interactive bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200/50 group-hover:from-purple-100 group-hover:to-violet-200">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
                      Manage
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Edit your game templates
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/history" className="group">
              <div className="card-interactive bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-200/50 group-hover:from-emerald-100 group-hover:to-teal-200">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg
                      className="w-8 h-8 text-white"
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
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                      History
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      View your game records
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/stats" className="group">
              <div className="card-interactive bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200/50 group-hover:from-amber-100 group-hover:to-orange-200">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg
                      className="w-8 h-8 text-white"
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
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-amber-700 transition-colors">
                      Statistics
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Analyze your performance
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Games Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
              Available Games
            </h3>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Select a game template to start playing
            </p>
          </div>

          <GameTemplateList
            templates={templates}
            onSelectTemplate={handleSelectTemplate}
            selectedTemplateId={selectedTemplate?.id}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>FizzBuzz Game - Play Custom Math Games Online</title>
        <meta
          name="description"
          content="Play customizable FizzBuzz games online. Create your own variants, track your progress, and compete with friends."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Modern Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-white font-bold text-lg">F</span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    FizzBuzz Game
                  </h1>
                </div>
              </Link>

              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/manage-templates" className="nav-link">
                  Manage
                </Link>
                <Link href="/history" className="nav-link">
                  History
                </Link>
                <Link href="/stats" className="nav-link">
                  Statistics
                </Link>
              </nav>

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <svg
                  className="w-6 h-6 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8 animate-fade-in">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 leading-tight">
                  FizzBuzz
                  <br />
                  <span className="text-4xl md:text-6xl">Reimagined</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                  Create, play, and master custom FizzBuzz games. Challenge
                  yourself with unique rules and compete with players worldwide.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Link href="/create-game">
                  <button className="btn-primary btn-lg px-8 py-4 text-lg font-semibold">
                    Create Your Game
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </Link>
                <Link href="#games">
                  <button className="btn-secondary btn-lg px-8 py-4 text-lg">
                    Browse Games
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-float"></div>
          <div
            className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </section>

        {/* Main Content */}
        <main
          id="games"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        >
          <div className="animate-slide-up">{renderContent()}</div>
        </main>

        {/* Modern Footer */}
        <footer className="bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">F</span>
                </div>
                <span className="text-xl font-semibold">FizzBuzz Game</span>
              </div>
              <p className="text-slate-400 max-w-md mx-auto">
                Create and play custom FizzBuzz variants. Challenge your mind
                and compete with friends.
              </p>
              <div className="text-sm text-slate-500">
                © 2025 FizzBuzz Game. Built with passion for learning and fun.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
