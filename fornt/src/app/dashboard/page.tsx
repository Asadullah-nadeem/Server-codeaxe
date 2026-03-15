"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Send, User, LogOut, CheckCircle, XCircle, Clock } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

interface Request {
  id: string;
  name: string;
  email: string;
  phone: string;
  requirement: string;
  portfolio_category: string | null;
  comment: string | null;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      
    const sessionStr = typeof window !== 'undefined' ? localStorage.getItem("mock_session") : null;
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    
      if (!session) {
        router.push("/login");
        return;
      }
      setUserName(session.user.user_metadata?.full_name || session.user.email || "");
      fetchRequests();
    };
    checkAuth();
  }, [router]);

  const fetchRequests = async () => {
    
    const prevStr = localStorage.getItem("mock_requests");
    const data = prevStr ? JSON.parse(prevStr) : [];
    const error: any = null;
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    
    localStorage.removeItem("mock_session");
    window.dispatchEvent(new Event("storage"));
    
    router.push("/");
  };

  const statusConfig = {
    approved: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10", label: "Approved" },
    rejected: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", label: "Rejected" },
    pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted", label: "Pending" },
  };

  return (
    <>
      <div className="container py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl tracking-tighter">Dashboard</h1>
            <p className="text-muted-foreground font-mono-label text-xs uppercase tracking-widest mt-1">Welcome, {userName}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/send-request">
              <Button className="font-mono-label text-xs uppercase tracking-widest gap-2">
                <Send size={14} /> Send Request
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="icon"><User size={16} /></Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut size={16} /></Button>
          </div>
        </div>

        {/* Requests List */}
        <div className="border border-border">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">Your Requests</h2>
          </div>
          {loading ? (
            <div className="p-12 text-center text-muted-foreground font-mono-label text-xs">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No requests yet</p>
              <Link href="/send-request">
                <Button className="font-mono-label text-xs uppercase tracking-widest">Send your first request</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {requests.map((req) => {
                const sc = statusConfig[req.status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = sc.icon;
                return (
                  <div key={req.id} className="px-6 py-5 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{req.requirement}</p>
                      <p className="text-muted-foreground text-xs mt-1">{req.name} · {req.email}</p>
                      {req.portfolio_category && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-mono-label uppercase tracking-widest border border-border text-muted-foreground">
                          {req.portfolio_category}
                        </span>
                      )}
                      {req.comment && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{req.comment}</p>}
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-label uppercase tracking-widest ${sc.bg} ${sc.color} shrink-0`}>
                      <StatusIcon size={12} />
                      {sc.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
