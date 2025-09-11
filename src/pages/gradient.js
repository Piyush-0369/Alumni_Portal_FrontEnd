import Navbar from "../components/ui/Navbar";

export default function GradientPeachMint() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex flex-col items-center justify-start p-8 gap-8 flex-1">
        <h1 className="text-white text-3xl font-bold mb-4">Peach & Mint Gradients</h1>

        <div className="w-full max-w-lg h-48 rounded-xl bg-gradient-to-br from-amber-200 to-emerald-200 shadow-lg" />
        <div className="w-full max-w-lg h-48 rounded-xl bg-gradient-to-b from-amber-200 to-emerald-200 shadow-lg" />
        <div className="w-full max-w-lg h-48 rounded-xl bg-gradient-to-l from-amber-200 to-emerald-200 shadow-lg" />
        <div className="w-full max-w-lg h-48 rounded-xl bg-gradient-to-tr from-amber-200 to-emerald-200 shadow-lg" />
        <div className="w-full max-w-lg h-48 rounded-xl bg-gradient-to-br from-amber-200/70 to-emerald-200/70 shadow-lg" />
      </main>
    </div>
  );
}
