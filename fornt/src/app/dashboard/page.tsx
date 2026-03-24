"use client";
import ChatWindow from "@/components/ChatWindow";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, FolderKanban, Loader2, LogOut, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [activeChat, setActiveChat] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("api_token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      router.push("/login"); // Not authenticated
      return;
    }
    setUser(JSON.parse(storedUser));

    fetch(`${API}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data);
        } else {
          // Token invalid or expired
          setError(json.message);
          if (json.message.includes("Unauthorized")) {
            localStorage.removeItem("api_token");
            localStorage.removeItem("user");
            setTimeout(() => router.push("/login"), 1500);
          }
        }
      })
      .catch(() => setError("Failed to fetch dashboard data."))
      .finally(() => setLoading(false));

    // Background polling for instant logout if banned by admin
    const checkAuthInterval = setInterval(async () => {
      try {
        const res = await fetch(`${API}/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("api_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } catch (e) { }
    }, 5000);

    return () => clearInterval(checkAuthInterval);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("api_token");
    localStorage.removeItem("user");
    localStorage.removeItem("mock_session");
    router.push("/login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "in_progress": return "text-accent bg-accent/10 border-accent/20";
      case "completed": return "text-green-500 bg-green-500/10 border-green-500/20";
      default: return "text-muted-foreground bg-muted/10 border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock size={14} className="mr-1 inline-block" />;
      case "in_progress": return <FolderKanban size={14} className="mr-1 inline-block" />;
      case "completed": return <CheckCircle size={14} className="mr-1 inline-block" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="fullscreen-loader">
        <Loader2 className="animate-spin text-primary" size={56} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-24 md:py-32 min-h-[60vh] flex justify-center items-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button onClick={() => router.push("/login")} className="text-accent underline">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const { ui, requests } = data || {};

  return (
    <div className="container py-24 md:py-32 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-border pb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-display mb-2">
            Hey, <span className="text-accent">{user?.username || "there"}</span>
          </h1>
          <p className="text-muted-foreground">{ui?.subtitle || "Manage your requests and track progress."}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
          <Link
            href="/send-request"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-mono-label text-xs uppercase tracking-widest hover:bg-accent transition-colors"
          >
            <Plus size={14} /> New Request
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 border border-border bg-background px-6 py-3 font-mono-label text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <LogOut size={14} /> Log Out
          </button>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-xl font-display mb-6">Your Projects</h2>

        {requests && requests.length > 0 ? (
          <div className="grid gap-6">
            {requests.map((req: any) => (
              <div key={req.id} className="border border-border p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:border-foreground/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium">{req.title}</h3>
                    <span className={`px-2 py-0.5 border text-[10px] font-mono-label uppercase tracking-wider ${getStatusColor(req.status)}`}>
                      {getStatusIcon(req.status)}
                      {req.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 max-w-3xl">
                    {req.description}
                  </p>
                  <div className="flex gap-4 mt-4 text-xs font-mono-label text-muted-foreground">
                    <span>TYPE: <span className="text-foreground">{req.service_type}</span></span>
                    {req.budget && <span>BUDGET: <span className="text-foreground">{req.budget}</span></span>}
                    <span>DATE: <span className="text-foreground">{new Date(req.created_at).toLocaleDateString()}</span></span>
                  </div>
                </div>
                <div className="flex shrink-0">
                  <button
                    onClick={() => setActiveChat({ id: req.id, title: req.title })}
                    className="inline-flex items-center gap-2 border border-border bg-background px-4 py-3 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent hover:border-accent transition-all duration-200"
                  >
                    <MessageSquare size={14} /> Messages
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border p-12 text-center">
            <FolderKanban size={32} strokeWidth={1} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground mb-6">You haven't submitted any project requests yet.</p>
            <Link
              href="/send-request"
              className="inline-flex items-center gap-2 font-mono-label text-xs uppercase tracking-widest text-accent hover:text-primary transition-colors"
            >
              Start Your First Project <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </motion.div>

      {activeChat && (
        <ChatWindow
          requestId={activeChat.id}
          title={activeChat.title}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}
