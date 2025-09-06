import Navbar from "../components/ui/Navbar";
import SignupForm from "../components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="flex items-center justify-center p-8">
        <SignupForm />
      </main>
    </div>
  );
}
