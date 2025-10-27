import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/auth/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to request reset");
      }
      
      toast({ 
        title: "Check your email", 
        description: "If an account exists with that email, you'll receive password reset instructions." 
      });
      setEmail(""); // Clear the input
    } catch (e) {
      console.error("Password reset request error:", e);
      toast({ 
        variant: "destructive", 
        title: "Failed to request reset",
        description: "Please try again later." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-strong">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Reset your password</h2>
        <p className="mb-6 text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="h-11"
              placeholder="your@email.com"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity font-semibold"
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
          <Button 
            type="button"
            variant="outline"
            className="w-full h-12 font-semibold"
            onClick={() => window.history.back()}
          >
            Back to Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
