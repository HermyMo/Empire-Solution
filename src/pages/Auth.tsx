import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/useAuth";
import ForgotPasswordForm from "@/components/ui/forgot-password-form";

const RegisterForm = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notify, setNotify] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register({
        email,
        password,
        name,
        phone: notify ? phone : undefined,
        notifyBySMS: notify
      });
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by AuthContext
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-11"
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-name">Name</Label>
        <Input
          id="register-name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-11"
        />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="notify"
          checked={notify}
          onCheckedChange={(checked) => setNotify(checked as boolean)}
        />
        <Label
          htmlFor="notify"
          className="text-sm text-muted-foreground cursor-pointer"
        >
          Remind me about this event via SMS
        </Label>
      </div>

      {notify && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11"
          />
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity font-semibold text-base mt-6"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Register"}
      </Button>
    </form>
  );
};

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by AuthContext
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-11"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="link"
          className="text-primary px-0 h-auto font-normal hover:text-primary/90"
          onClick={() => navigate("/request-reset")}
        >
          Forgot your password?
        </Button>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity font-semibold text-base"
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
};

const Auth = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-3 sm:p-4 safe-top safe-bottom">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-strong p-6 sm:p-8 md:p-12">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="bg-gradient-primary p-2.5 sm:p-3 rounded-full">
              <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 h-11 sm:h-auto">
              <TabsTrigger value="login" className="text-sm sm:text-base touch-target">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="text-sm sm:text-base touch-target">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
