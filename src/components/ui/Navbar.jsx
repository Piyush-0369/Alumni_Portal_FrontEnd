import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Alumni Portal</h1>
      <div className="flex gap-4">
        <Link href="/profile" className="hover:underline">
          Profile
        </Link>
        <Link href="/events" className="hover:underline">
          Events
        </Link>
        <Link href="/admin" className="hover:underline">
          Admin
        </Link>
        <Link href="/LoginForm" className="hover:underline">
          Login
        </Link>
        <Link href="/SignupForm" className="hover:underline">
          Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
