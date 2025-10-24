import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Phone, 
  FileText, 
  BookOpen, 
  CheckCircle, 
  User,
  AlertCircle,
  Heart,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const emergencyContacts = [
    { name: "Emergency Services", number: "911", icon: AlertCircle },
    { name: "National Hotline", number: "1-800-799-7233", icon: Phone },
    { name: "Crisis Text Line", number: "Text HOME to 741741", icon: MessageSquare },
  ];

  const quickActions = [
    { 
      title: "Report Incident", 
      description: "Confidentially report an incident",
      icon: FileText,
      color: "bg-primary",
      action: () => {}
    },
    { 
      title: "Safety Resources", 
      description: "Access support and information",
      icon: BookOpen,
      color: "bg-secondary",
      action: () => {}
    },
    { 
      title: "Safety Check-In", 
      description: "Let trusted contacts know you're safe",
      icon: CheckCircle,
      color: "bg-success",
      action: () => {}
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">SafeSupport</h1>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/dashboard/profile")}
              className="rounded-full"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
          <p className="text-muted-foreground">Your safety and well-being matter. We're here to help.</p>
        </div>

        {/* Emergency Contacts */}
        <Card className="p-6 mb-8 bg-gradient-hero border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Emergency Contacts</h3>
          </div>
          <div className="grid gap-3">
            {emergencyContacts.map((contact) => (
              <div 
                key={contact.name}
                className="flex items-center justify-between bg-card p-4 rounded-lg shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <contact.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.number}</p>
                  </div>
                </div>
                <Button 
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  Call
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Card 
                key={action.title}
                className="p-6 hover:shadow-medium transition-shadow cursor-pointer group"
                onClick={action.action}
              >
                <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{action.title}</h4>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Message */}
        <Card className="p-6 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-4">
            <div className="bg-accent/10 p-3 rounded-full">
              <Heart className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">You're Not Alone</h4>
              <p className="text-muted-foreground">
                If you're experiencing violence or need support, help is available 24/7. 
                Our resources are confidential and designed to keep you safe.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
