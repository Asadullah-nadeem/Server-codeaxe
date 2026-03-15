"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";


const portfolioOptions = [
  { value: "chrome-extensions", label: "Chrome Extensions" },
  { value: "web-tools", label: "Web Tools" },
  { value: "app-store", label: "App Store" },
  { value: "play-store", label: "Play Store" },
  { value: "client-projects", label: "Client Projects" },
];

const SendRequest = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requirement, setRequirement] = useState("");
  const [portfolioCategory, setPortfolioCategory] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
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
      setEmail(session.user.email || "");
      setName(session.user.user_metadata?.full_name || "");
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const sessionStr = typeof window !== 'undefined' ? localStorage.getItem("mock_session") : null;
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    
    if (!session) {
      router.push("/login");
      return;
    }

    
    const newReq = { id: Date.now().toString(), name, phone, email, requirement, portfolio_category: portfolioCategory || null, comment: comment || null, status: "pending", created_at: new Date().toISOString() };
    const existingStr = localStorage.getItem("mock_requests");
    const existing = existingStr ? JSON.parse(existingStr) : [];
    localStorage.setItem("mock_requests", JSON.stringify([newReq, ...existing]));
    const error: any = null;
    

    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Request sent!", description: "Your request has been submitted successfully." });
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div className="container max-w-lg py-12">
        <h1 className="font-display text-3xl tracking-tighter mb-2">Send Request</h1>
        <p className="text-muted-foreground font-mono-label text-xs uppercase tracking-widest mb-8">Tell us what you need</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="font-mono-label text-xs uppercase tracking-widest">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label className="font-mono-label text-xs uppercase tracking-widest">Phone Number</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label className="font-mono-label text-xs uppercase tracking-widest">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label className="font-mono-label text-xs uppercase tracking-widest">Requirement</Label>
            <Textarea value={requirement} onChange={(e) => setRequirement(e.target.value)} required className="mt-1" placeholder="Describe what you need..." />
          </div>
          <div>
            <Label className="font-mono-label text-xs uppercase tracking-widest">Portfolio Category (Optional)</Label>
            <Select value={portfolioCategory} onValueChange={setPortfolioCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {portfolioOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-mono-label text-xs uppercase tracking-widest">Comment</Label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} className="mt-1" placeholder="Any additional notes..." />
          </div>
          <Button type="submit" disabled={loading} className="w-full font-mono-label text-xs uppercase tracking-widest">
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default SendRequest;
