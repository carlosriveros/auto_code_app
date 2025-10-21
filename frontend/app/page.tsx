import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
          Build Apps with AI
        </h1>
        <p className="text-xl md:text-2xl text-gray-700">
          Code from your phone using Claude AI. Create, edit, and deploy web apps anywhere.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/dashboard"
            className="touch-target px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="#features"
            className="touch-target px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Learn More
          </Link>
        </div>

        <div id="features" className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Claude AI generates code based on your natural language prompts
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-semibold mb-2">Mobile-First</h3>
            <p className="text-gray-600">
              Build and manage projects directly from your phone
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold mb-2">Deploy Instantly</h3>
            <p className="text-gray-600">
              One-click deployment to Vercel for live apps
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
