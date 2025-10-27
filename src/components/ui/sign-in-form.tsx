import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignInFormProps {
  onToggleForm: () => void;
  onForgotPassword: () => void;
}

const SignInForm = ({ onToggleForm, onForgotPassword }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle sign in logic
    // For now, we'll just log the values
    console.log("Sign in:", { email, password });
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signin-password">Password</Label>
          <Input
            id="signin-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11"
          />
        </div>

        <Button
          type="button"
          variant="link"
          className="text-primary px-0 h-auto font-normal hover:text-primary/90"
          onClick={onForgotPassword}
        >
          Forgot your password?
        </Button>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity font-semibold text-base"
        >
          Sign In
        </Button>

        <div className="text-center">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Button
            type="button"
            variant="link"
            className="text-primary px-1 h-auto font-normal hover:text-primary/90"
            onClick={onToggleForm}
          >
            Register
          </Button>
        </div>
      </form>
    </>
  );
};

export default SignInForm;