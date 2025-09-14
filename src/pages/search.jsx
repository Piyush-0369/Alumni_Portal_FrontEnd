// src/pages/search.jsx
import dynamic from "next/dynamic";

const SearchUsers = dynamic(() => import("../components/chat/SearchUsers"), { ssr: false });

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-emerald-50 to-emerald-200">
      <SearchUsers />
    </div>
  );
}
