import Link from "next/link";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const commonLinks = [
    { name: "Profile", href: "/profile" },
    { name: "Events", href: "/events" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-amber-200 to-emerald-200 border-b border-amber-100 shadow-md">
      <div className="flex items-center justify-between py-4 px-4 md:px-6 w-full">
        {/* Brand */}
        <Link href="/" className="text-lg font-bold text-emerald-800">
          Alumni Portal
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {commonLinks.map((page) => (
            <Link
              key={page.name}
              href={page.href}
              className="text-sm font-medium text-emerald-800 hover:text-emerald-900 transition-colors"
            >
              {page.name}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                href="/search"
                className="text-sm font-medium text-emerald-800 hover:text-emerald-900 transition-colors"
              >
                Search
              </Link>
              <Link
                href="/chat"
                className="text-sm font-medium text-emerald-800 hover:text-emerald-900 transition-colors"
              >
                Chats
              </Link>
              <span className="text-sm font-semibold text-emerald-900">
                {user.first_name} {user.last_name}
              </span>
            </>
          ) : (
            <>
              <Link
                href="/LoginForm"
                className="rounded-xl bg-white bg-opacity-30 px-4 py-2 text-sm font-semibold text-emerald-800 shadow hover:bg-opacity-50 transition"
              >
                Login
              </Link>
              <Link
                href="/SignupForm"
                className="rounded-xl bg-white bg-opacity-30 px-4 py-2 text-sm font-semibold text-emerald-800 shadow hover:bg-opacity-50 transition"
              >
                Signup
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-30 transition"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          <svg
            className="h-6 w-6 text-emerald-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden bg-gradient-to-r from-amber-200 to-emerald-200 border-t border-amber-100">
          <div className="flex flex-col gap-3 py-4 px-4 md:px-6 w-full">
            {commonLinks.map((page) => (
              <Link
                key={page.name}
                href={page.href}
                className="text-sm font-medium text-emerald-800 hover:text-emerald-900 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {page.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/search"
                  className="text-sm font-medium text-emerald-800 hover:text-emerald-900 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Search
                </Link>
                <Link
                  href="/chat"
                  className="text-sm font-medium text-emerald-800 hover:text-emerald-900 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Chats
                </Link>
                <span className="text-sm font-semibold text-emerald-900">
                  {user.first_name} {user.last_name}
                </span>
              </>
            ) : (
              <>
                <Link
                  href="/LoginForm"
                  className="rounded-xl bg-white bg-opacity-30 px-4 py-2 text-sm font-semibold text-emerald-800 shadow hover:bg-opacity-50 transition text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/SignupForm"
                  className="rounded-xl bg-white bg-opacity-30 px-4 py-2 text-sm font-semibold text-emerald-800 shadow hover:bg-opacity-50 transition text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
