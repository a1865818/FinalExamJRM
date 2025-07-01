import ErrorMessage from "@/components/ErrorMessage";
import GameTemplateList from "@/components/GameTemplateList";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { gameTemplateApi, handleApiError } from "@/services/api";
import { GameTemplate } from "@/types/game";
import { BarChart3, History, Plus, Settings, Sparkles } from "lucide-react";
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

  const heroActions = (
    <>
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
    </>
  );

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
        <div className="space-y-8" id="games">
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
    <Layout
      title="FizzBuzz Game - Play Custom Math Games Online"
      description="Play customizable FizzBuzz games online. Create your own variants, track your progress, and compete with friends."
      showHero={true}
      heroTitle="FizzBuzz Reimagined"
      heroDescription="Create, play, and master custom FizzBuzz games. Challenge yourself with unique rules and compete with players worldwide."
      heroActions={heroActions}
    >
      <div className="animate-slide-up pt-8">{renderContent()}</div>
    </Layout>
  );
};

export default HomePage;
