// src/components/chat/SearchUsers.jsx
import { useState } from "react";
import { fetchWithRefresh } from "../../utils/fetchWithRefresh";
import { useRouter } from "next/router";

export default function SearchUsers() {
  const [role, setRole] = useState("");
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const doSearch = async () => {
    if (!role) { alert("Choose a role to search (Student or Alumni)"); return; }
    setLoading(true);
    try {
      const res = await fetchWithRefresh(`http://localhost:4000/api/v1/baseUsers/search?role=${role}&q=${encodeURIComponent(q)}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({message:"Search failed"}));
        throw new Error(err.message || "Search failed");
      }
      const data = await res.json();
      setResults(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const startChat = async (user) => {
    try {
      const res = await fetchWithRefresh("http://localhost:4000/api/v1/chat/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ recipientId: user._id, recipientRole: user.role }),
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({message:"Cannot start chat"}));
        throw new Error(err.message || "Cannot start chat");
      }
      const data = await res.json();
      const conv = data.data;
      router.push(`/chat?cid=${conv._id}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Cannot start chat");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Search users</h2>

      <div className="mb-4 flex gap-2">
        <button onClick={() => setRole("Student")} className={`px-3 py-1 rounded ${role==="Student" ? "bg-amber-400 text-white" : "bg-emerald-200"}`}>Students</button>
        <button onClick={() => setRole("Alumni")} className={`px-3 py-1 rounded ${role==="Alumni" ? "bg-amber-400 text-white" : "bg-emerald-200"}`}>Alumni</button>
      </div>

      <div className="flex gap-2 mb-4">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search name / email / dept / batch..." className="flex-1 p-2 border rounded" />
        <button onClick={doSearch} className="px-4 py-2 bg-amber-400 rounded text-white">{loading ? "Searching..." : "Search"}</button>
      </div>

      <div className="space-y-2">
        {results.map(user => (
          <div key={user._id} className="flex items-center justify-between p-3 border rounded bg-white">
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-semibold">{user.first_name} {user.middle_name || ""} {user.last_name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-xs text-gray-500">{user.role} — {user.batch_year || ""} {user.department || user.course || ""}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => startChat(user)} className="px-3 py-1 bg-black text-white rounded">Chat</button>
            </div>
          </div>
        ))}
        {results.length === 0 && !loading && <div className="text-gray-500">No results</div>}
      </div>
    </div>
  );
}
