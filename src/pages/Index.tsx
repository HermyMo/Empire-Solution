import { Button } from "@/components/ui/button";
import { Shield, Heart, Users, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-primary p-4 rounded-2xl shadow-medium">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            SafeSupport
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Your safety and well-being are our priority. Access confidential support, 
            resources, and help when you need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg h-14 px-8 font-semibold"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg h-14 px-8 font-semibold border-2"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            How We Support You
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">24/7 Support</h3>
              <p className="text-muted-foreground">
                Access emergency contacts and crisis support lines anytime, day or night.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-shadow">
              <div className="bg-secondary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Confidential Care</h3>
              <p className="text-muted-foreground">
                Your privacy matters. Report incidents and access resources in complete confidence.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-shadow">
              <div className="bg-success/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Community Support</h3>
              <p className="text-muted-foreground">
                Connect with resources, support groups, and professional help in your area.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            You're Not Alone
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands who have found safety, support, and hope through our platform.
          </p>
          <Button 
            size="lg"
            className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg h-14 px-8 font-semibold"
            onClick={() => navigate("/auth")}
          >
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 SafeSupport. Your safety is our priority.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
