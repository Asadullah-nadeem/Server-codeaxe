"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { Trash2 } from "lucide-react";

const Profile = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      
    const sessionStr = typeof window !== 'undefined' ? localStorage.getItem("mock_session") : null;
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    
      if (!session) {
        router.push("/login");
        return;
      }
      
    const pStr = localStorage.getItem("mock_profile");
    const data = pStr ? JSON.parse(pStr) : { full_name: session.user.user_metadata?.full_name, email: session.user.email, phone: "" };
    
      if (data) {
        setFullName(data.full_name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
      }
      setLoading(false);
    };
    loadProfile();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    
    const sessionStr = typeof window !== 'undefined' ? localStorage.getItem("mock_session") : null;
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    
    if (!session) return;

    
    localStorage.setItem("mock_profile", JSON.stringify({ full_name: fullName, phone, email: session.user.email }));
    const error: any = null;
    
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated" });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    
    const sessionStr = typeof window !== 'undefined' ? localStorage.getItem("mock_session") : null;
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    
    if (!session) return;

    // Delete profile and sign out (account deletion requires admin API in production)
    
    localStorage.removeItem("mock_profile");
    localStorage.removeItem("mock_requests");
    
    
    localStorage.removeItem("mock_session");
    window.dispatchEvent(new Event("storage"));
    
    toast({ title: "Account data deleted" });
    router.push("/");
  };

  if (loading) {
    return (
      <>
        <div className="container py-20 text-center text-muted-foreground">Loading...</div>
      </>
    );
  }

  return (
    <>
      <div className="container max-w-md py-12">
        <h1 className="font-display text-3xl tracking-tighter mb-2">Profile</h1>
        <p className="text-muted-foreground font-mono-label text-xs uppercase tracking-widest mb-8">Your account details</p>

        <div className="space-y-5">
          <div>
            <Label className="font-mono-label text-xs uppercase tracking-widest">Full Name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="font-mono-label text-xs uppercase tracking-widest">Email</Label>
            <Input value={email} disabled className="mt-1 opacity-60" />
          </div>
          <div>
            <Label className="font-mono-label text-xs uppercase tracking-widest">Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full font-mono-label text-xs uppercase tracking-widest">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="font-mono-label text-xs uppercase tracking-widest text-destructive mb-3">Danger Zone</h2>
          <Button variant="destructive" onClick={handleDelete} className="w-full font-mono-label text-xs uppercase tracking-widest gap-2">
            <Trash2 size={14} /> Delete Account
          </Button>
        </div>
      </div>
    </>
  );
};

export default Profile;
