import Link from "next/link";
import SupabaseTest from "@/components/SupabaseTest";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 My E-Commerce
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Next.js + Supabase + Tailwind CSS
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Next.js</h3>
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ready to use</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supabase</h3>
                <span className="text-2xl">🔥</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Configured</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tailwind</h3>
                <span className="text-2xl">🎨</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Styling ready</p>
            </div>
          </div>

          {/* Supabase Connection Status */}
          <div className="mb-8">
            <SupabaseTest />
          </div>

          {/* Getting Started */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              🎯 Getting Started
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4 flex-shrink-0">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Set up Supabase
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Create a project at{" "}
                    <a 
                      href="https://app.supabase.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      supabase.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4 flex-shrink-0">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Copy environment variables
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Copy <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">.env.example</code> to{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">.env.local</code>
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-xs font-mono overflow-x-auto">
                    cp .env.example .env.local
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4 flex-shrink-0">
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Add your credentials
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Update <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">.env.local</code> with your Supabase URL and anon key
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4 flex-shrink-0">
                  4
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Start building!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Check the README.md for examples and best practices
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                📚 Next.js Docs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn about Next.js features and API
              </p>
            </Link>

            <Link
              href="https://supabase.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🗄️ Supabase Docs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Database, auth, storage, and more
              </p>
            </Link>

            <Link
              href="https://tailwindcss.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🎨 Tailwind Docs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Utility-first CSS framework
              </p>
            </Link>

            <Link
              href="https://github.com/vercel/next.js/tree/canary/examples"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                💡 Examples
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Explore Next.js examples and templates
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
