import Navbar from "../components/ui/Navbar";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Welcome to Alumni Portal
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-xl">
          Connect with fellow alumni, participate in events, and explore mentorship opportunities.
        </p>

        {/* Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/LoginForm">
            <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
            Get Started
            </button>
        </Link>
        <Link href="/events">
            <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300 transition">
            View Events
            </button>
        </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-600 border-t mt-auto">
        &copy; 2025 Alumni Portal. All rights reserved.
      </footer>
    </div>
  );
}
