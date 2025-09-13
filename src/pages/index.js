// src/pages/index.js
import Link from "next/link";
import { motion } from "framer-motion";

export default function Landing() {
  const slides = [
    "/images/hero1.jpg",
    "/images/hero2.jpeg",
    "/images/hero3.jpeg",
  ];

  // Duplicate slides so animation looks seamless
  const loopSlides = [...slides, ...slides];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-amber-100 via-emerald-50 to-emerald-200">
      {/* Continuous carousel background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="flex h-full"
          animate={{ x: ["0%", "-50%"] }} // slide left infinitely
          transition={{
            repeat: Infinity,
            duration: 15, // slower = smoother
            ease: "linear",
          }}
        >
          {loopSlides.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`slide-${idx}`}
              className="object-cover w-screen h-full opacity-40"
            />
          ))}
        </motion.div>
      </div>

      {/* Overlay content */}
      <main className="relative flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-20 z-10">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-emerald-900 drop-shadow-lg">
          Welcome to Alumni Portal
        </h1>
        <p className="text-lg sm:text-xl text-gray-800 mb-8 max-w-xl bg-white/60 rounded-lg p-4 shadow">
          Connect with fellow alumni, participate in events, and explore mentorship opportunities.
        </p>

        {/* Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/LoginForm">
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg shadow hover:bg-emerald-700 transition">
              Get Started
            </button>
          </Link>
          <Link href="/events">
            <button className="bg-amber-500 text-white px-6 py-3 rounded-lg shadow hover:bg-amber-600 transition">
              View Events
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}