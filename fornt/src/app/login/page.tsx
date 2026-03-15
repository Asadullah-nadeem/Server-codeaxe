"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock login
    const error = password === "wrong" ? new Error("Invalid credentials") : null;
    if (!error) {
      localStorage.setItem("mock_session", JSON.stringify({ user: { id: "1", email, user_metadata: { full_name: "Mock User" } } }));
      window.dispatchEvent(new Event("storage"));
    }
    await new Promise(r => setTimeout(r, 500));
    
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div className="container max-w-md py-20">
        <h1 className="font-display text-3xl tracking-tighter mb-2">Login</h1>
        <p className="text-muted-foreground font-mono-label text-xs uppercase tracking-widest mb-8">Access your dashboard</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="font-mono-label text-xs uppercase tracking-widest">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password" className="font-mono-label text-xs uppercase tracking-widest">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
          </div>
          <Button type="submit" disabled={loading} className="w-full font-mono-label text-xs uppercase tracking-widest">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account? <Link href="/signup" className="text-accent hover:underline">Sign up</Link>
        </p>
      </div>
    </>
  );
};

export default Login;
