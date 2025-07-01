import ErrorMessage from "@/components/ErrorMessage";
import GameTemplateList from "@/components/GameTemplateList";
import LoadingSpinner from "@/components/LoadingSpinner";
import { gameTemplateApi, handleApiError } from "@/services/api";
import { GameTemplate } from "@/types/game";
import {
  BarChart3,
  History,
  Menu,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";
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
                    <Plus className="w-8 h-8 text-white" />
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
                    <Settings className="w-8 h-8 text-white" />
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
                    <History className="w-8 h-8 text-white" />
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
                    <BarChart3 className="w-8 h-8 text-white" />
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
                <Menu className="w-6 h-6 text-slate-600" />
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
                    <Sparkles className="w-5 h-5 ml-2" />
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
