// src/pages/chat/index.jsx
import { useEffect, useState, useRef } from "react";
import { fetchWithRefresh } from "../../utils/fetchWithRefresh";
import { initSocket, joinRoom, sendSocketMessage, onReceiveMessage, disconnectSocket } from "../../utils/socketClient";
import { useRouter } from "next/router";

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const router = useRouter();
  const messagesEndRef = useRef(null);

  // Get current user (safe on SSR)
  const me = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userData") || "{}") : {};

  useEffect(() => {
    initSocket();
    onReceiveMessage((msg) => {
      setMessages(prev => {
        if (prev.some(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });

      setConversations(prev => {
        const others = prev.filter(c => c._id !== (msg.conversationId?._id || msg.conversationId));
        const idx = prev.findIndex(c => c._id === (msg.conversationId?._id || msg.conversationId));
        if (idx !== -1) {
          const updated = { ...prev[idx], updatedAt: new Date().toISOString() };
          return [updated, ...others];
        }
        return prev;
      });
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    const fetchConvs = async () => {
      setLoadingConvs(true);
      try {
        const res = await fetchWithRefresh("http://localhost:4000/api/v1/chat/conversations", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch conversations");
        const data = await res.json();
        setConversations(Array.isArray(data.data) ? data.data : []);
        const cid = router.query.cid;
        if (cid) {
          const c = data.data.find(c => c._id === cid);
          if (c) setSelectedConv(c);
        } else if (data.data.length) {
          setSelectedConv(data.data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingConvs(false);
      }
    };
    fetchConvs();
  }, [router.query.cid]);

  useEffect(() => {
    if (!selectedConv) return;
    const convId = selectedConv._id;
    joinRoom(convId);
    const fetchMessages = async () => {
      try {
        const res = await fetchWithRefresh(`http://localhost:4000/api/v1/chat/messages/${convId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load messages");
        const data = await res.json();
        const msgs = Array.isArray(data.data) ? data.data.reverse() : [];
        setMessages(msgs);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [selectedConv]);

  const sendMessage = () => {
    if (!text.trim() || !selectedConv) return;
    sendSocketMessage({ conversationId: selectedConv._1d || selectedConv._id, text: text.trim() }); // minor fallback
    setText("");
  };

  // compute the "other" member for the header (works if members are populated objects or just ids)
  const otherMember = (() => {
    if (!selectedConv?.members) return null;
    return selectedConv.members.find(m => {
      const id = (typeof m === "string") ? m : (m._id ? String(m._id) : null);
      return id !== String(me._id);
    }) || (typeof selectedConv.members[0] === "string" ? null : selectedConv.members[0]);
  })();

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-amber-100 via-emerald-50 to-emerald-200 flex">
      {/* Left: Conversations */}
      <aside className="w-80 bg-white rounded p-3 mr-4 overflow-auto">
        <h3 className="font-semibold mb-3">Chats</h3>
        {loadingConvs ? <div>Loading...</div> : (
          <div className="space-y-2">
            {conversations.map(conv => {
              const other = conv.members?.find(m => {
                const id = (typeof m === "string") ? m : (m._id ? String(m._id) : null);
                return id !== String(me._id);
              });
              return (
                <div key={conv._id} onClick={() => setSelectedConv(conv)} className={`p-2 rounded cursor-pointer ${selectedConv?._id === conv._id ? "bg-amber-50" : "hover:bg-gray-50"}`}>
                  <div className="flex items-center gap-3">
                    <img src={other?.avatar} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-medium">{other?.first_name} {other?.last_name}</div>
                      <div className="text-xs text-gray-500">{other?.role} • {new Date(conv.updatedAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            {conversations.length === 0 && <div className="text-gray-500">No conversations yet</div>}
          </div>
        )}
      </aside>

      {/* Right: Messages */}
      <main className="flex-1 bg-white rounded p-4 flex flex-col">
        {!selectedConv && <div className="text-gray-600">Select a chat to start messaging</div>}

        {selectedConv && (
          <>
            {/* HEADER: show only the OTHER person's name */}
            <div className="border-b pb-3 mb-3">
              <div className="font-semibold">
                {otherMember ? `${otherMember.first_name || ""} ${otherMember.last_name || ""}` : "Chat"}
              </div>
            </div>

            <div className="flex-1 overflow-auto mb-3 p-2">
              <div className="space-y-3">
                {messages.map(msg => {
                  const meLocal = me;
                  const isMe = msg.sender && ((msg.sender._id && String(msg.sender._id) === String(meLocal._id)) || String(msg.sender) === String(meLocal._id));
                  return (
                    <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`${isMe ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-800"} rounded-lg p-2 max-w-[70%]`}>
                        <div className="text-sm">{msg.text}</div>
                        <div className="text-xs mt-1 text-right opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded"
              />
              <button onClick={sendMessage} className="px-4 py-2 bg-black text-white rounded">Send</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
