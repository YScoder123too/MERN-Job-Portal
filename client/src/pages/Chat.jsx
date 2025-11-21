import React, { useEffect, useRef, useState } from "react";
import {
  User,
  Bot,
  Briefcase,
  Headphones,
  GraduationCap,
  Send,
  MessageSquare,
  Trash2,
  Plus,
  Edit3,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../services/api";

const STORAGE_KEY = "ai_chat_app_v1";
const DEFAULT_HISTORY = [
  { id: "today", title: "Today’s Session", mode: "assistant" },
  { id: "resume", title: "Resume Feedback", mode: "hr" },
  { id: "interview", title: "Interview Practice", mode: "interview" },
];

const DEFAULT_CONVERSATIONS = {
  assistant: [
    {
      role: "assistant",
      content:
        "👋 Hi! I’m your AI career assistant. I can help with resumes, interviews, and career advice. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ],
  hr: [
    {
      role: "assistant",
      content:
        "💼 Hello! I’m HR Support — I can answer policy, leave, payroll, and process questions. What do you need?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ],
  interview: [
    {
      role: "assistant",
      content:
        "🎤 Ready for mock interviews! Choose a topic and I’ll ask you questions and provide feedback.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ],
};

const QUICK_PROMPTS = [
  "Improve my resume",
  "Mock interview (front-end)",
  "How to negotiate salary",
  "Write a professional summary",
  "List top skills for 2025",
  "How to ask for a referral",
];

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mode, setMode] = useState("assistant");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [listening, setListening] = useState(false);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const [conversations, setConversations] = useState(DEFAULT_CONVERSATIONS);
  const [history, setHistory] = useState(DEFAULT_HISTORY);
  const [activeHistoryId, setActiveHistoryId] = useState(history[0].id);

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Guest User",
    role: "Professional",
    email: "guest@example.com",
  };

  const profile = {
    name: user.name,
    role: user.role,
    email: user.email,
    avatarBg: "bg-gradient-to-tr from-indigo-500 to-pink-500",
  };

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.conversations) setConversations(parsed.conversations);
      if (parsed.history) {
        setHistory(parsed.history);
        setActiveHistoryId(parsed.activeHistoryId || parsed.history[0]?.id || "today");
      }
    }
  }, []);

  useEffect(() => {
    const payload = { conversations, history, activeHistoryId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [conversations, history, activeHistoryId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, mode, loading]);

  const messages = conversations[mode] || [];
  const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // ===== Main send function =====
  const send = async (text = null) => {
  const message = ((text ?? input) || "").trim();
  if (!message) return;

  const userMsg = { role: "user", content: message, time: nowTime() };

  setConversations((prev) => ({
    ...prev,
    [mode]: [...(prev[mode] || []), userMsg],
  }));

  setInput("");
  setLoading(true);

  try {
    let endpoint = "";
    let body = {};

    if (mode === "assistant") {
      // Gemini general chat
      endpoint = "/api/ai/chat";
      body = { messages: [{ role: "user", content: message }] };

    } else if (mode === "hr") {
      // HR assistant
      endpoint = "/api/ai/hr";
      body = { question: message };

    } else if (mode === "interview") {
      // Interview bot
      endpoint = "/api/ai/interview";
      body = { context: message, role: "Software Engineer" };
    }

    const res = await api.post(endpoint, body);

    const replyText =
      res?.data?.message || "⚠️ Gemini did not return a response.";

    const assistantMsg = {
      role: "assistant",
      content: replyText,
      time: nowTime(),
    };

    setConversations((prev) => ({
      ...prev,
      [mode]: [...(prev[mode] || []), assistantMsg],
    }));
  } catch (err) {
    console.error("Chat error:", err);
    const errorMsg = {
      role: "assistant",
      content: "⚠️ Server error. Gemini is not responding.",
      time: nowTime(),
    };

    setConversations((prev) => ({
      ...prev,
      [mode]: [...(prev[mode] || []), errorMsg],
    }));
  } finally {
    setLoading(false);
  }
};


  // ===== Resume Analyzer =====
  const sendResumeForAnalysis = async (resumeText, jobDescription) => {
    if (!resumeText || !jobDescription) return;

    const userMsg = { role: "user", content: "Please review my resume.", time: nowTime() };
    setConversations((prev) => ({
      ...prev,
      [mode]: [...(prev[mode] || []), userMsg],
    }));
    setLoading(true);

    try {
      const res = await api.post("/ai/analyze-resume", { resumeText, jobDescription });
      const replyText = `
Resume Score: ${res.data.score}%\n
Keywords Matched: ${res.data.keywordsMatched.join(", ")}\n
Missing Keywords: ${res.data.missingKeywords.join(", ")}\n
LLM Suggestions:\n${res.data.llmSuggestion}
      `;

      const assistantMsg = { role: "assistant", content: replyText, time: nowTime() };
      setConversations((prev) => ({
        ...prev,
        [mode]: [...(prev[mode] || []), assistantMsg],
      }));
    } catch (err) {
      const errorMsg = { role: "assistant", content: "⚠️ Resume analysis failed. Please try again.", time: nowTime() };
      setConversations((prev) => ({
        ...prev,
        [mode]: [...(prev[mode] || []), errorMsg],
      }));
    } finally {
      setLoading(false);
    }
  };

  // ===== Other helper functions (same as your previous code) =====
  const createNewConversation = (title = "New Conversation", convMode = mode) => {
    const id = `conv_${Date.now()}`;
    const newEntry = { id, title, mode: convMode, lastUpdated: Date.now() };
    setHistory((prev) => [newEntry, ...prev]);
    setActiveHistoryId(id);
    setConversations((prev) => ({
      ...prev,
      [convMode]: prev[convMode] ? prev[convMode] : DEFAULT_CONVERSATIONS[convMode] || [],
    }));
    setMode(convMode);
  };

  const deleteHistory = (id) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (activeHistoryId === id) {
      const next = history.find((h) => h.id !== id);
      setActiveHistoryId(next?.id || history[0]?.id || "today");
      setMode(next?.mode || "assistant");
    }
  };

  const renameHistory = (id) => {
    const newTitle = prompt("Enter new title for this conversation:");
    if (!newTitle) return;
    setHistory((prev) => prev.map((h) => (h.id === id ? { ...h, title: newTitle } : h)));
  };

  const openHistoryItem = (item) => {
    setActiveHistoryId(item.id);
    setMode(item.mode);
    setConversations((prev) => ({
      ...prev,
      [item.mode]: prev[item.mode] ?? DEFAULT_CONVERSATIONS[item.mode] ?? [],
    }));
  };

  const clearConversation = () => {
    if (!confirm("Clear conversation for this mode?")) return;
    setConversations((prev) => ({ ...prev, [mode]: [] }));
  };

  const modeLabel = (m) => {
    if (m === "assistant") return "Career Assistant";
    if (m === "hr") return "HR Support";
    return "Interview Coach";
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        send(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (listening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  // ===== JSX (same UI as your original) =====
  return (
    <div className="h-screen flex bg-gradient-to-br from-indigo-50 to-white">
      {/* Sidebar */}
      <aside className={`flex-shrink-0 transition-all duration-300 ${sidebarOpen ? "w-72" : "w-16"} border-r bg-white/60 backdrop-blur-md shadow-lg`}>
        {/* Sidebar content same as original */}
        <div className="h-full flex flex-col">
          {/* Profile + Collapse button */}
          <div className="px-3 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${profile.avatarBg} shadow-md`}>
                <span className="font-semibold">{profile.name.split(" ").map(n => n[0]).slice(0, 2).join("")}</span>
              </div>
              {sidebarOpen && (
                <div>
                  <div className="text-sm font-semibold text-gray-800">{profile.name}</div>
                  <div className="text-xs text-gray-500">{profile.role}</div>
                </div>
              )}
            </div>
            <button onClick={() => setSidebarOpen(v => !v)} className="p-2 rounded-full hover:bg-gray-100/60 transition" title={sidebarOpen ? "Collapse" : "Expand"}>
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {/* New conversation + clear */}
          <div className="px-3 py-2 border-t">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => createNewConversation(`${modeLabel(mode)} ${new Date().toLocaleDateString()}`, mode)}
                className="flex-1 text-xs md:text-sm rounded-lg bg-indigo-600 text-white px-2 py-2 flex items-center gap-2 justify-center hover:scale-[1.01] transition"
                title="Start new conversation"
              >
                <Plus size={14} /> {sidebarOpen ? "New" : ""}
              </button>
              {sidebarOpen && (
                <button
                  onClick={clearConversation}
                  className="text-xs rounded-lg border px-2 py-2 hover:bg-red-50 text-red-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* History list */}
          <div className="p-3 overflow-auto flex-1">
            <div className="text-xs font-semibold text-gray-600 mb-2 px-1">Conversations</div>
            <div className="space-y-2">
              {history.map((h) => (
                <div key={h.id} className={`flex items-center gap-2 px-2 py-2 rounded-lg ${activeHistoryId === h.id ? "bg-indigo-50 border border-indigo-100" : "hover:bg-gray-50"}`}>
                  <button onClick={() => openHistoryItem(h)} className="flex-1 text-left text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md bg-white/80 flex items-center justify-center text-indigo-600 shadow-sm">
                        <MessageSquare size={14} />
                      </div>
                      {sidebarOpen && (
                        <div>
                          <div className="text-sm font-medium">{h.title}</div>
                          <div className="text-xs text-gray-500">{modeLabel(h.mode)}</div>
                        </div>
                      )}
                    </div>
                  </button>
                  {sidebarOpen && (
                    <div className="flex items-center gap-1">
                      <button title="Rename" onClick={() => renameHistory(h.id)} className="p-1 rounded hover:bg-gray-100">
                        <Edit3 size={14} />
                      </button>
                      <button title="Delete" onClick={() => deleteHistory(h.id)} className="p-1 rounded hover:bg-red-50 text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 border-t text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <div>{sidebarOpen ? "AI Suite" : ""}</div>
              <div className="text-right">{sidebarOpen ? "v1.0" : null}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-lg font-semibold">AI Assistant Dashboard</div>
              <div className="flex items-center gap-2 bg-white/8 rounded-full p-1">
                <ModePill active={mode === "assistant"} onClick={() => setMode("assistant")} icon={<GraduationCap size={16} />} label="Career" />
                <ModePill active={mode === "hr"} onClick={() => setMode("hr")} icon={<Headphones size={16} />} label="HR" />
                <ModePill active={mode === "interview"} onClick={() => setMode("interview")} icon={<Briefcase size={16} />} label="Interview" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm opacity-90">{modeLabel(mode)}</div>
              <button
                onClick={() => setVoiceEnabled(v => !v)}
                className={`px-3 py-1 rounded-full text-xs ${voiceEnabled ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {voiceEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
              </button>
              <div className="text-xs bg-white/10 px-3 py-1 rounded-full">Pro</div>
            </div>
          </div>
        </div>

        <section className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6 max-w-5xl mx-auto">
            <div className="space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex items-end ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && <div className="mr-3 p-2 bg-white/80 rounded-full shadow-sm"><Bot size={18} className="text-indigo-700" /></div>}
                  <div className={`px-4 py-3 rounded-2xl shadow-xl max-w-[78%] ${m.role === "user" ? "bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-br-none" : "bg-white/90 border border-gray-200 rounded-bl-none"}`}>
                    <div className="prose-sm break-words">{m.content}</div>
                    <div className="text-xs text-gray-400 mt-2 text-right">{m.time}</div>
                  </div>
                  {m.role === "user" && <div className="ml-3 p-2 bg-indigo-100 rounded-full shadow-sm"><User size={18} className="text-indigo-700" /></div>}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="p-2 bg-indigo-100 rounded-full"><Bot size={16} className="text-indigo-600" /></div>
                  <div className="bg-white/90 px-3 py-2 rounded-xl shadow animate-pulse">Assistant is typing<span className="ml-2">...</span></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Quick prompts */}
          <div className="px-6 pb-4 max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-3">
              {QUICK_PROMPTS.map((q, i) => (
                <button key={i} onClick={() => send(q)} className="px-3 py-2 rounded-full bg-white shadow-sm hover:bg-indigo-50/80 transition text-sm">
                  {q}
                </button>
              ))}
              {/* Resume Review Button */}
              <button
                onClick={() => sendResumeForAnalysis(
                  "Paste your resume text here...",
                  "Paste the job description here..."
                )}
                className="px-3 py-2 rounded-full border-dashed border text-sm"
              >
                Resume review prompt
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="bg-white/80 backdrop-blur-md border-t px-6 py-4 sticky bottom-0">
            <div className="max-w-5xl mx-auto flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a message..."
                className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button onClick={() => send()} className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white">
                <Send size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// ===== Mode Pill Component =====
function ModePill({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${active ? "bg-white text-indigo-600" : "bg-white/10 text-white hover:bg-white/20"}`}>
      {icon} {label}
    </button>
  );
}
