import Navbar from "../components/ui/Navbar";
import SignupForm from "../components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-100 via-emerald-50 to-emerald-200">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-[var(--color-surface)] rounded-2xl shadow-soft-lg p-10 relative overflow-hidden">
            {/* Decorative gradient inside card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/20 to-emerald-200/20 pointer-events-none rounded-2xl" />

            {/* Content */}
            <div className="relative z-10">
              <h1 className="text-3xl font-semibold text-emerald-800 mb-2">
                Create an account
              </h1>
              <p className="mb-6 text-sm text-emerald-700">
                Join the Alumni Portal and connect with your community.
              </p>

              {/* Signup form */}
              <SignupForm />

              {/* Extra link */}
              <p className="mt-6 text-center text-sm text-emerald-600">
                Already have an account?{" "}
                <a
                  href="/LoginForm"
                  className="font-medium text-amber-400 hover:text-amber-500 transition-colors"
                >
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
