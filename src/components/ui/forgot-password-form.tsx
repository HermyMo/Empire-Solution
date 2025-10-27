import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset email logic
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <>
        <h2 className="text-2xl font-bold text-center mb-4 text-foreground">
          Check Your Email
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          If an account exists with {email}, we've sent password reset instructions to your email address.
        </p>
        <Button
          type="button"
          className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity font-semibold text-base"
          onClick={onBack}
        >
          Back to Sign In
        </Button>
      </>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-4 text-foreground">
        Reset Password
      </h2>
      <p className="text-center text-muted-foreground mb-6">
        Enter your email address and we'll send you instructions to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email</Label>
          <Input
            id="reset-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity font-semibold text-base"
          >
            Send Reset Instructions
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 font-semibold text-base"
            onClick={onBack}
          >
            Back to Sign In
          </Button>
        </div>
      </form>
    </>
  );
};

export default ForgotPasswordForm;