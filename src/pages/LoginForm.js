import Navbar from "../components/ui/Navbar";
import LoginForm from "../components/auth/LoginForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-8">
        <LoginForm />
      </main>
    </div>
  );
}
