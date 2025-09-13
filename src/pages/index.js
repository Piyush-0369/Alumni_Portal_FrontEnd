// src/pages/index.js
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Landing() {
  const slides = [
    "/images/hero1.jpg",
    "/images/hero2.jpg",
    "/images/hero3.jpg",
  ];

  const [index, setIndex] = useState(0);

  // Auto move carousel
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000); // change every 6s
    return () => clearInterval(interval);
  }, [index]);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-amber-100 via-emerald-50 to-emerald-200">
      {/* Carousel Background */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={slides[index]}
            alt={`slide-${index}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 object-cover w-full h-full opacity-60"
          />
        </AnimatePresence>
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

      {/* Carousel Navigation */}
      <div className="absolute inset-0 flex items-center justify-between px-6 z-20">
        <button
          onClick={handlePrev}
          className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
