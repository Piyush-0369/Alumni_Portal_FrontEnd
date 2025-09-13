import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-100 via-emerald-50 to-emerald-200">

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-20">
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 text-emerald-900 drop-shadow-sm tracking-tight">
          Welcome to Alumni Portal
        </h1>

        <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-2xl leading-relaxed">
          Connect with fellow alumni, participate in events, and explore mentorship opportunities.
        </p>

        {/* Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-5">
          <Link href="/LoginForm">
            <button
              className="px-8 py-3 rounded-xl font-semibold shadow-md 
                         bg-amber-400 text-white hover:bg-amber-500
                         transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </button>
          </Link>

          <Link href="/events">
            <button
              className="px-8 py-3 rounded-xl font-semibold shadow-md 
                         bg-emerald-600 text-white hover:bg-emerald-700
                         transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              View Events
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}