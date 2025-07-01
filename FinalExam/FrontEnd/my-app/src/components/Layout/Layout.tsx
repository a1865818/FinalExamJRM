import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showHero?: boolean;
  heroTitle?: string;
  heroDescription?: string;
  heroActions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "FizzBuzz Game",
  description = "Create and play custom FizzBuzz variants",
  className = "min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100",
  showHero = false,
  heroTitle,
  heroDescription,
  heroActions,
}) => {
  const router = useRouter();

  const year = new Date().getFullYear();

  const isActivePage = (path: string) => {
    return router.pathname === path;
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={className}>
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
                <Link
                  href="/"
                  className={isActivePage("/") ? "nav-link-active" : "nav-link"}
                >
                  Home
                </Link>
                <Link
                  href="/manage-templates"
                  className={
                    isActivePage("/manage-templates")
                      ? "nav-link-active"
                      : "nav-link"
                  }
                >
                  Manage
                </Link>
                <Link
                  href="/history"
                  className={
                    isActivePage("/history") ? "nav-link-active" : "nav-link"
                  }
                >
                  History
                </Link>
                <Link
                  href="/stats"
                  className={
                    isActivePage("/stats") ? "nav-link-active" : "nav-link"
                  }
                >
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
        {showHero && heroTitle && (
          <section className="relative py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/50"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-6 animate-fade-in">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 leading-tight">
                    {heroTitle}
                  </h1>
                  {heroDescription && (
                    <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
                      {heroDescription}
                    </p>
                  )}
                </div>

                {heroActions && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                    {heroActions}
                  </div>
                )}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-amber-200/30 rounded-full blur-xl animate-float"></div>
            <div
              className="absolute bottom-20 right-10 w-32 h-32 bg-orange-200/30 rounded-full blur-xl animate-float"
              style={{ animationDelay: "1s" }}
            ></div>
          </section>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {children}
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
                © {year} FizzBuzz Game. Built with passion for learning and fun.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
