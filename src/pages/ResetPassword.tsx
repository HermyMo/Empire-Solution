import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tokenFromQuery = params.get("token") || undefined;
  const [token, setToken] = useState<string | undefined>(tokenFromQuery);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (tokenFromQuery) setToken(tokenFromQuery);
  }, [tokenFromQuery]);

  const API_URL = "http://localhost:3000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast({ variant: "destructive", title: "Missing token" });
    if (password.length < 6) return toast({ variant: "destructive", title: "Password too short" });
    if (password !== confirm) return toast({ variant: "destructive", title: "Passwords do not match" });
    setIsLoading(true);
    try {
      // Call backend API directly (do not rely on dev server proxy)
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        let msg = "Reset failed";
        try {
          const j = await res.json();
          if (j?.message) msg = j.message;
        } catch (_) {
          // ignore JSON parse error and keep generic message
        }
        throw new Error(msg);
      }
      toast({ title: "Password reset. You can now sign in." });
      navigate("/auth");
    } catch (e) {
      const err = e as Error;
      toast({ variant: "destructive", title: "Failed to reset password", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-card rounded-lg">
        <h2 className="text-xl font-bold mb-4">Choose a new password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="token">Token (or use link)</Label>
            <Input id="token" value={token || ""} onChange={(e) => setToken(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          <Button type="submit" disabled={isLoading}>{isLoading ? "Resetting..." : "Reset password"}</Button>
        </form>
      </div>
    </div>
  );
}
