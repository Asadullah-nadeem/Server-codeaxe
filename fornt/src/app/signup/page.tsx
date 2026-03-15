"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";


const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock signup
    const error: any = null;
    await new Promise(r => setTimeout(r, 500));
    
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created", description: "Check your email to verify, then log in." });
      router.push("/login");
    }
  };

  return (
    <>
      <div className="container max-w-md py-20">
        <h1 className="font-display text-3xl tracking-tighter mb-2">Sign Up</h1>
        <p className="text-muted-foreground font-mono-label text-xs uppercase tracking-widest mb-8">Create your account</p>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Label htmlFor="name" className="font-mono-label text-xs uppercase tracking-widest">Full Name</Label>
            <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email" className="font-mono-label text-xs uppercase tracking-widest">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password" className="font-mono-label text-xs uppercase tracking-widest">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1" />
          </div>
          <Button type="submit" disabled={loading} className="w-full font-mono-label text-xs uppercase tracking-widest">
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link href="/login" className="text-accent hover:underline">Log in</Link>
        </p>
      </div>
    </>
  );
};

export default Signup;
