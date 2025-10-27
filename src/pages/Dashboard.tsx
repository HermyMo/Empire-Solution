import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Shield, 
  Phone, 
  FileText, 
  BookOpen, 
  CheckCircle, 
  User,
  AlertCircle,
  Heart,
  MessageSquare,
  Settings,
  LogOut,
  UserCircle,
  UserPlus,
  Edit,
  Trash2,
  Users,
  Mail,
  Upload,
  X,
  Calendar,
  MapPin,
  Save,
  Lock,
  Eye,
  EyeOff,
  ExternalLink,
  Clock,
  Paperclip
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import Chatbot from "@/components/ui/chatbot";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

type TrustedContact = {
  id: number;
  name: string;
  phone: string;
  email: string;
  relationship: string;
};

type Report = {
  id: string;
  category: string;
  description: string;
  date?: string;
  time?: string;
  location?: string;
  involvedParties?: string;
  isAnonymous: boolean;
  isWitness: boolean;
  submittedAt: string;
  attachments?: { name: string; size: number; type: string }[];
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const API_URL = "http://localhost:3000/api";

  // State for trusted contacts
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "",
  });
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  // State for Report Incident
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    category: "",
    description: "",
    date: "",
    time: "",
    location: "",
    involvedParties: "",
    isAnonymous: false,
    isWitness: false,
    recipientEmail: "",
    vaultPassword: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isSafetyScreenOpen, setIsSafetyScreenOpen] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // State for Viewing Reports
  const [isViewReportsOpen, setIsViewReportsOpen] = useState(false);
  const [viewPassword, setViewPassword] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // State for Support Message Dialog
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem("report_draft");
    if (draft) {
      setHasDraft(true);
    }
  }, []);

  // Load trusted contacts from backend on mount
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setIsLoadingContacts(false);
          return;
        }
        const response = await fetch(`${API_URL}/trusted-contacts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setTrustedContacts(data.trustedContacts || []);
        }
      } catch (error) {
        console.error("Failed to load contacts:", error);
      } finally {
        setIsLoadingContacts(false);
      }
    };
    loadContacts();
  }, []);

  // Save trusted contacts to backend whenever they change
  const saveContacts = async (contacts: TrustedContact[]) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;
      await fetch(`${API_URL}/trusted-contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trustedContacts: contacts }),
      });
    } catch (error) {
      console.error("Failed to save contacts:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Could not save contacts to server.",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const updatedContacts = [
        ...trustedContacts,
        {
          id: Date.now(),
          ...newContact,
        },
      ];
      setTrustedContacts(updatedContacts);
      saveContacts(updatedContacts);
      setNewContact({ name: "", phone: "", email: "", relationship: "" });
      setIsAddContactOpen(false);
    }
  };

  const handleEditContact = (contact: TrustedContact) => {
    setEditingContact(contact);
    setNewContact({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      relationship: contact.relationship,
    });
    setIsAddContactOpen(true);
  };

  const handleUpdateContact = () => {
    if (editingContact && newContact.name && newContact.phone) {
      const updatedContacts = trustedContacts.map((contact) =>
        contact.id === editingContact.id
          ? { ...contact, ...newContact }
          : contact
      );
      setTrustedContacts(updatedContacts);
      saveContacts(updatedContacts);
      setEditingContact(null);
      setNewContact({ name: "", phone: "", email: "", relationship: "" });
      setIsAddContactOpen(false);
    }
  };

  const handleDeleteContact = (id: number) => {
    const updatedContacts = trustedContacts.filter((contact) => contact.id !== id);
    setTrustedContacts(updatedContacts);
    saveContacts(updatedContacts);
  };

  const handleDialogClose = () => {
    setIsAddContactOpen(false);
    setEditingContact(null);
    setNewContact({ name: "", phone: "", email: "", relationship: "" });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    const draft = {
      reportForm,
      attachmentNames: attachments.map(f => f.name),
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("report_draft", JSON.stringify(draft));
    setHasDraft(true);
    toast({
      title: "Draft saved",
      description: "Your report has been saved locally. You can continue it later.",
    });
  };

  const handleLoadDraft = () => {
    const draft = localStorage.getItem("report_draft");
    if (draft) {
      const parsed = JSON.parse(draft);
      setReportForm(parsed.reportForm);
      toast({
        title: "Draft loaded",
        description: "Your previous draft has been restored.",
      });
    }
  };

  const handleClearDraft = () => {
    localStorage.removeItem("report_draft");
    setHasDraft(false);
  };

  const handleViewReports = async () => {
    if (!viewPassword || viewPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Password required",
        description: "Please enter your vault password (min 6 characters).",
      });
      return;
    }

    try {
      setIsLoadingReports(true);
      const response = await fetch(`${API_URL}/reports?password=${encodeURIComponent(viewPassword)}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      setReports(data.reports || []);
      
      if (data.reports.length === 0) {
        toast({
          title: "No reports found",
          description: "No reports were found with that password, or the password is incorrect.",
        });
      } else {
        toast({
          title: "Reports loaded",
          description: `Found ${data.reports.length} report(s).`,
        });
      }
    } catch (error) {
      console.error("Failed to load reports:", error);
      toast({
        variant: "destructive",
        title: "Failed to load reports",
        description: "Could not retrieve reports. Please check your password.",
      });
    } finally {
      setIsLoadingReports(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!reportForm.category || !reportForm.description) {
      toast({
        variant: "destructive",
        title: "Required fields missing",
        description: "Please select a category and provide a description.",
      });
      return;
    }

    if (!reportForm.vaultPassword || reportForm.vaultPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Vault password required",
        description: "Please set a secure password (min 6 characters) to encrypt your report.",
      });
      return;
    }

    try {
      setIsSubmittingReport(true);
      
      const token = localStorage.getItem("auth_token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token && !reportForm.isAnonymous) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const reportData = {
        ...reportForm,
        attachments: attachments.map(f => ({ name: f.name, size: f.size, type: f.type })),
        submittedAt: new Date().toISOString(),
        userId: reportForm.isAnonymous ? null : user?.id,
        reportType: reportForm.isWitness ? "witness" : "personal",
      };

      // Submit report to encrypted vault
      const reportResponse = await fetch(`${API_URL}/reports`, {
        method: "POST",
        headers,
        body: JSON.stringify(reportData),
      });

      if (!reportResponse.ok) {
        throw new Error("Failed to save report");
      }

      // Send email if recipient specified
      if (reportForm.recipientEmail) {
        const emailSubject = `Incident Report: ${reportForm.category} - ${reportForm.isAnonymous ? "Anonymous" : user?.name || "User"}`;
        const emailText = `
A ${reportForm.isWitness ? "witness" : "personal"} incident report has been submitted.

${!reportForm.isAnonymous && user ? `Reported by: ${user.name}
Reporter Email: ${user.email}
Reporter ID: ${user.id}

` : ''}Category: ${reportForm.category}
Date: ${reportForm.date || "Not specified"}
Time: ${reportForm.time || "Not specified"}
Location: ${reportForm.location || "Not specified"}

Description:
${reportForm.description}

${reportForm.involvedParties ? `Involved Parties:\n${reportForm.involvedParties}` : ""}

Submitted: ${new Date().toLocaleString()}
${reportForm.isAnonymous ? "\n(This report was submitted anonymously - reporter identity not available)" : "\n(This report includes the reporter's identity for follow-up purposes)"}
        `.trim();

        const emailResponse = await fetch(`${API_URL}/alerts/email`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            to: reportForm.recipientEmail,
            subject: emailSubject,
            text: emailText,
            html: `<div style="font-family:Arial,sans-serif"><h2>Incident Report</h2><pre>${emailText}</pre></div>`,
          }),
        });

        if (emailResponse.ok) {
          const emailResult = await emailResponse.json();
          const successCount = emailResult.results?.filter((r: { ok: boolean }) => r.ok).length || 0;
          const totalCount = emailResult.results?.length || 0;
          
          if (successCount > 0) {
            toast({
              title: "Report sent",
              description: `Report successfully sent to ${successCount} recipient${successCount !== 1 ? 's' : ''}.`,
            });
          }
        }
      }

      // Clear draft after successful submission
      handleClearDraft();
      
      // Reset form
      setReportForm({
        category: "",
        description: "",
        date: "",
        time: "",
        location: "",
        involvedParties: "",
        isAnonymous: false,
        isWitness: false,
        recipientEmail: "",
        vaultPassword: "",
      });
      setAttachments([]);
      setIsReportOpen(false);
      
      // Show safety screen
      setIsSafetyScreenOpen(true);
    } catch (error) {
      console.error("Failed to submit report:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Could not submit report. Please try again.",
      });
    } finally {
      setIsSubmittingReport(false);
    }
  };

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
      action: () => setIsReportOpen(true)
    },
    { 
      title: "Safety Resources", 
      description: "Access support and information",
      icon: BookOpen,
      color: "bg-secondary",
    
      action: () => navigate("/resources")
    },
    { 
      title: "Safety Check-In", 
      description: "Let trusted contacts know you're safe",
      icon: CheckCircle,
      color: "bg-success",
      action: () => setIsCheckInOpen(true)
    },
  ];

  // Try to fetch current geolocation (returns null if blocked/unavailable)
  const getLocation = async (): Promise<{ lat: number; lng: number } | null> => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return null;
    try {
      const pos: GeolocationPosition = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
      const { latitude, longitude } = pos.coords;
      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        return { lat: latitude, lng: longitude };
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleCheckIn = async (status: "safe" | "not_safe") => {
    const emails = trustedContacts.map(c => c.email).filter(Boolean);
    const phones = trustedContacts.map(c => c.phone).filter(Boolean);

    if (emails.length === 0 && phones.length === 0) {
      toast({
        variant: "destructive",
        title: "No trusted contacts",
        description: "Add at least one trusted contact with an email or phone number.",
      });
      return;
    }

    try {
      setIsSending(true);
      const token = localStorage.getItem("auth_token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const displayName = user?.name || "Your contact";
      const now = new Date().toLocaleString();
      const loc = await getLocation();
      const mapUrl = loc ? `https://www.google.com/maps?q=${loc.lat},${loc.lng}` : null;
      const coordsText = loc ? `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}` : "Unavailable";
      const isSafe = status === "safe";
      const emailSubject = `Safety Check-in: ${isSafe ? "I'm Safe" : "Not Safe"}`;
      const emailText = `${displayName} sent a safety check-in: ${isSafe ? "I'm Safe" : "Not Safe"} at ${now}.
Location: ${coordsText}${mapUrl ? `\nMaps: ${mapUrl}` : ""}`;
        const emailHtml = `
          <div style="font-family:Arial,sans-serif">
          <h2>Safety Check-in</h2>
          <p><strong>${displayName}</strong> reported their status:</p>
          <p style="font-size:16px">${isSafe ? "✅ I'm Safe" : "🚨 Not Safe"}</p>
            <p style="color:#555">Time: ${now}</p>
            <p style="color:#555">Location: ${coordsText}</p>
            ${mapUrl ? `<p><a href="${mapUrl}">View on Google Maps</a></p>` : ""}
            <p style="margin-top:16px;color:#666">This message was sent automatically from SafeSupport.</p>
        </div>`;
      const smsMessage = `Safety check-in from ${displayName}: ${isSafe ? "I'm SAFE" : "NOT SAFE"}. Time: ${now}. Location: ${coordsText}${mapUrl ? ` ${mapUrl}` : ""}`;

  const ops: Promise<Response>[] = [];
      if (emails.length) {
        ops.push(
          fetch(`${API_URL}/alerts/email`, {
            method: "POST",
            headers,
            body: JSON.stringify({ to: emails, subject: emailSubject, text: emailText, html: emailHtml })
          })
        );
      }
      if (phones.length) {
        ops.push(
          fetch(`${API_URL}/alerts/sms`, {
            method: "POST",
            headers,
            body: JSON.stringify({ to: phones, message: smsMessage })
          })
        );
      }

  const results = await Promise.allSettled(ops);
  const allOk = results.every(r => r.status === "fulfilled" && (r.value.ok));

      toast({
        title: isSafe ? "Check-in sent" : "Alert sent",
        description: allOk
          ? "Your trusted contacts have been notified."
          : "Some notifications may have failed. Please verify your server settings.",
      });
      setIsCheckInOpen(false);
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Failed to send",
        description: e instanceof Error ? e.message : "Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-50 safe-top">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="bg-gradient-primary p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">SafeSupport</h1>
            </div>
            
            {/* Profile Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full touch-target flex-shrink-0"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/resources")}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Resources</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8 safe-bottom">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {user?.name ? `Welcome back ${user.name}` : "Welcome back"}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">Your safety and well-being matter. We're here to help.</p>
        </div>

        {/* Emergency Contacts */}
        <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-gradient-hero border-primary/20">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Emergency Contacts</h3>
          </div>
          <div className="grid gap-2 sm:gap-3">
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

        {/* Trusted Contacts Section */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              <h3 className="text-lg font-semibold text-foreground">My Trusted Contacts</h3>
            </div>
            <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2" onClick={() => setEditingContact(null)}>
                  <UserPlus className="h-4 w-4" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingContact ? "Edit Trusted Contact" : "Add Trusted Contact"}
                  </DialogTitle>
                  <DialogDescription>
                    Add someone you trust who can be contacted in case of emergency.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Full Name *</Label>
                    <Input
                      id="contact-name"
                      placeholder="Enter contact's name"
                      value={newContact.name}
                      onChange={(e) =>
                        setNewContact({ ...newContact, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Phone Number *</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="+27 XX XXX XXXX"
                      value={newContact.phone}
                      onChange={(e) =>
                        setNewContact({ ...newContact, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email Address</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="contact@example.com"
                      value={newContact.email}
                      onChange={(e) =>
                        setNewContact({ ...newContact, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-relationship">Relationship</Label>
                    <Input
                      id="contact-relationship"
                      placeholder="e.g., Parent, Friend, Sibling"
                      value={newContact.relationship}
                      onChange={(e) =>
                        setNewContact({ ...newContact, relationship: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={editingContact ? handleUpdateContact : handleAddContact}
                  >
                    {editingContact ? "Update Contact" : "Add Contact"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            These contacts will be notified when you use the emergency panic button.
          </p>

          <div className="space-y-3">
            {trustedContacts.filter(c => c.name).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No trusted contacts added yet.</p>
                <p className="text-sm">Click "Add Contact" to get started.</p>
              </div>
            ) : (
              trustedContacts
                .filter((contact) => contact.name)
                .map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 bg-accent/5 rounded-lg border border-border hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-secondary/10 p-2 rounded-full">
                        <User className="h-4 w-4 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{contact.name}</p>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </span>
                          {contact.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </span>
                          )}
                        </div>
                        {contact.relationship && (
                          <span className="text-xs bg-secondary/10 px-2 py-0.5 rounded inline-block mt-1">
                            {contact.relationship}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditContact(contact)}
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </Card>

        {/* My Stored Reports */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-500" />
              <h3 className="text-xl font-semibold text-foreground">My Stored Reports</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter vault password to view reports"
                value={viewPassword}
                onChange={(e) => setViewPassword(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleViewReports}
                disabled={!viewPassword || isLoadingReports}
              >
                {isLoadingReports ? (
                  <>
                    <Eye className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    View Reports
                  </>
                )}
              </Button>
            </div>

            {reports.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  Found {reports.length} report{reports.length !== 1 ? 's' : ''}
                </p>
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="capitalize">
                            {report.category}
                          </Badge>
                          {report.isAnonymous && (
                            <Badge variant="secondary">Anonymous</Badge>
                          )}
                          {report.isWitness && (
                            <Badge variant="secondary">Witness Report</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {report.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted: {new Date(report.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <Eye className="h-4 w-4 text-muted-foreground ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {quickActions.map((action) => (
              <Card 
                key={action.title}
                className="p-4 sm:p-6 hover:shadow-medium transition-shadow cursor-pointer group active:scale-95 touch-target"
                onClick={action.action}
              >
                <div className={`${action.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h4 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2">{action.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">{action.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Message */}
        <Card 
          className="p-4 sm:p-6 bg-accent/5 border-accent/20 hover:shadow-medium transition-shadow cursor-pointer active:scale-[0.99] touch-target"
          onClick={() => setIsSupportDialogOpen(true)}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-accent/10 p-2.5 sm:p-3 rounded-full flex-shrink-0">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2">You're Not Alone</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                If you're experiencing violence or need support, help is available 24/7. 
                Our resources are confidential and designed to keep you safe.
              </p>
            </div>
          </div>
        </Card>
      </main>

      {/* Chatbot Component */}
      <Chatbot />

      {/* Safety Check-in Dialog */}
      <Dialog open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Safety Check-In</DialogTitle>
            <DialogDescription>
              Notify your trusted contacts of your current status. This will send both an email and an SMS to your saved contacts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Contacts to be notified: {trustedContacts.filter(c => c.email || c.phone).length}
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsCheckInOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                className="bg-green-600 hover:bg-green-600/90"
                onClick={() => handleCheckIn("safe")}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "I'm Safe"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleCheckIn("not_safe")}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Not Safe"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Incident Dialog */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mobile-scroll w-[calc(100vw-2rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Report Incident</DialogTitle>
            <DialogDescription className="text-sm">
              Please provide details about the incident. All information is confidential and will be handled with care.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
            {/* Load Draft Button */}
            {hasDraft && (
              <div className="bg-accent/10 border border-border rounded-lg p-3">
                <p className="text-sm mb-2">You have a saved draft</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadDraft}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Load Draft
                </Button>
              </div>
            )}

            {/* Anonymous and Witness Toggles */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-accent/5 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <Label htmlFor="anonymous-toggle" className="flex items-center gap-2 cursor-pointer">
                  <EyeOff className="h-4 w-4" />
                  Submit Anonymously
                </Label>
                <Switch
                  id="anonymous-toggle"
                  checked={reportForm.isAnonymous}
                  onCheckedChange={(checked) => setReportForm({ ...reportForm, isAnonymous: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="witness-toggle" className="flex items-center gap-2 cursor-pointer">
                  <Eye className="h-4 w-4" />
                  I'm a Witness
                </Label>
                <Switch
                  id="witness-toggle"
                  checked={reportForm.isWitness}
                  onCheckedChange={(checked) => setReportForm({ ...reportForm, isWitness: checked })}
                />
              </div>
            </div>

            {/* Show info based on anonymous toggle state */}
            {!reportForm.isAnonymous && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <UserCircle className="h-4 w-4 inline mr-1" />
                  Your identity will be attached to this report. This includes your name ({user?.name}) and email ({user?.email}).
                </p>
              </div>
            )}

            {reportForm.isAnonymous && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <EyeOff className="h-4 w-4 inline mr-1" />
                  This report will be submitted anonymously. Your identity will not be stored or shared.
                </p>
              </div>
            )}

            {reportForm.isWitness && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Thank you for reporting what you witnessed. Your information helps create a safer environment.
                </p>
              </div>
            )}

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="incident-category">Incident Category *</Label>
              <Select
                value={reportForm.category}
                onValueChange={(value) => setReportForm({ ...reportForm, category: value })}
              >
                <SelectTrigger id="incident-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="unsafe-environment">Unsafe Environment</SelectItem>
                  <SelectItem value="theft">Theft</SelectItem>
                  <SelectItem value="discrimination">Discrimination</SelectItem>
                  <SelectItem value="accident">Accident</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="incident-description">Description *</Label>
              <Textarea
                id="incident-description"
                placeholder="Describe what happened in your own words..."
                value={reportForm.description}
                onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Provide as much detail as you feel comfortable sharing
              </p>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incident-date">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date
                </Label>
                <Input
                  id="incident-date"
                  type="date"
                  value={reportForm.date}
                  onChange={(e) => setReportForm({ ...reportForm, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incident-time">Time</Label>
                <Input
                  id="incident-time"
                  type="time"
                  value={reportForm.time}
                  onChange={(e) => setReportForm({ ...reportForm, time: e.target.value })}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="incident-location">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location
              </Label>
              <Input
                id="incident-location"
                placeholder="Where did this occur?"
                value={reportForm.location}
                onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
              />
            </div>

            {/* Involved Parties */}
            <div className="space-y-2">
              <Label htmlFor="involved-parties">Involved Parties</Label>
              <Textarea
                id="involved-parties"
                placeholder="Names or descriptions of people involved (optional)"
                value={reportForm.involvedParties}
                onChange={(e) => setReportForm({ ...reportForm, involvedParties: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Recipient Email */}
            <div className="space-y-2">
              <Label htmlFor="recipient-email">
                <Mail className="h-4 w-4 inline mr-1" />
                Send Report To (Email)
              </Label>
              <Input
                id="recipient-email"
                type="text"
                placeholder="email@example.com or multiple emails separated by commas (optional)"
                value={reportForm.recipientEmail}
                onChange={(e) => setReportForm({ ...reportForm, recipientEmail: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Send to anyone - not limited to trusted contacts. Use commas for multiple recipients.
              </p>
            </div>

            {/* Vault Password */}
            <div className="space-y-2">
              <Label htmlFor="vault-password">
                <Lock className="h-4 w-4 inline mr-1" />
                Vault Password * (Required)
              </Label>
              <Input
                id="vault-password"
                type="password"
                placeholder="Enter a secure password (min 6 characters)"
                value={reportForm.vaultPassword}
                onChange={(e) => setReportForm({ ...reportForm, vaultPassword: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                This password encrypts your report. Keep it safe - you'll need it to access your report later.
              </p>
            </div>

            {/* File Attachments */}
            <div className="space-y-2">
              <Label>
                <Upload className="h-4 w-4 inline mr-1" />
                Attachments (optional)
              </Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                  accept="image/*,video/*,.pdf,.doc,.docx"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Upload photos, videos, or documents (Max 10MB per file)
                </p>
              </div>

              {/* Show selected files */}
              {attachments.length > 0 && (
                <div className="space-y-2 mt-3">
                  <p className="text-sm font-medium">Selected files:</p>
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-accent/10 rounded border border-border"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-accent/5 border border-border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Your report is confidential. We take all reports seriously and will handle them with care and discretion.
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => {
                  setIsReportOpen(false);
                  setReportForm({
                    category: "",
                    description: "",
                    date: "",
                    time: "",
                    location: "",
                    involvedParties: "",
                    isAnonymous: false,
                    isWitness: false,
                    recipientEmail: "",
                    vaultPassword: "",
                  });
                  setAttachments([]);
                }}
                disabled={isSubmittingReport}
                className="w-full sm:w-auto touch-target"
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleSaveDraft}
                disabled={isSubmittingReport}
                className="gap-2 w-full sm:w-auto touch-target"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
            </div>
            <Button
              onClick={handleSubmitReport}
              disabled={isSubmittingReport}
              className="w-full sm:w-auto touch-target"
            >
              {isSubmittingReport ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Safety Screen Dialog - Post Submission */}
      <Dialog open={isSafetyScreenOpen} onOpenChange={setIsSafetyScreenOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">You're Not Alone</DialogTitle>
            <DialogDescription>
              Your report has been securely submitted. Here are some resources that may help you right now.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Immediate Safety */}
            <Card className="p-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                If You're in Immediate Danger
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                Call emergency services immediately
              </p>
              <Button className="bg-red-600 hover:bg-red-700 w-full">
                <Phone className="mr-2 h-4 w-4" />
                Call 911
              </Button>
            </Card>

            {/* Crisis Hotlines */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                24/7 Crisis Hotlines
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">National Hotline</p>
                    <p className="text-sm text-muted-foreground">1-800-799-7233</p>
                  </div>
                  <Button size="sm" variant="outline">Call</Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Crisis Text Line</p>
                    <p className="text-sm text-muted-foreground">Text HOME to 741741</p>
                  </div>
                  <Button size="sm" variant="outline">Text</Button>
                </div>
              </div>
            </Card>

            {/* Resources */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Helpful Resources
              </h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => navigate("/resources")}
                >
                  <span>Browse Support Resources</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => setIsSafetyScreenOpen(false)}
                >
                  <span>Return to Dashboard</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Safety Tips */}
            <Card className="p-4 bg-accent/5">
              <h3 className="font-semibold mb-3">What Happens Next?</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Your report is encrypted and stored securely</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You can access it anytime with your vault password</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Take time to care for yourself and seek support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Consider reaching out to a trusted friend or counselor</span>
                </li>
              </ul>
            </Card>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsSafetyScreenOpen(false)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Details
            </DialogTitle>
            <DialogDescription>
              View the full details of this incident report
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 py-4">
              {/* Status Badges */}
              <div className="flex gap-2">
                <Badge variant="outline" className="capitalize">
                  {selectedReport.category}
                </Badge>
                {selectedReport.isAnonymous && (
                  <Badge variant="secondary">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Anonymous
                  </Badge>
                )}
                {selectedReport.isWitness && (
                  <Badge variant="secondary">
                    <Eye className="h-3 w-3 mr-1" />
                    Witness Report
                  </Badge>
                )}
              </div>

              {/* Submission Time */}
              <div>
                <Label className="text-xs text-muted-foreground">Submitted At</Label>
                <p className="text-sm">
                  {new Date(selectedReport.submittedAt).toLocaleString()}
                </p>
              </div>

              {/* Description */}
              <div>
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="text-sm whitespace-pre-wrap">{selectedReport.description}</p>
              </div>

              {/* Date and Time */}
              {(selectedReport.date || selectedReport.time) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedReport.date && (
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Incident Date
                      </Label>
                      <p className="text-sm">{selectedReport.date}</p>
                    </div>
                  )}
                  {selectedReport.time && (
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Incident Time
                      </Label>
                      <p className="text-sm">{selectedReport.time}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Location */}
              {selectedReport.location && (
                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Location
                  </Label>
                  <p className="text-sm">{selectedReport.location}</p>
                </div>
              )}

              {/* Involved Parties */}
              {selectedReport.involvedParties && (
                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Involved Parties
                  </Label>
                  <p className="text-sm">{selectedReport.involvedParties}</p>
                </div>
              )}

              {/* Attachments */}
              {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    Attachments ({selectedReport.attachments.length})
                  </Label>
                  <div className="mt-2 space-y-1">
                    {selectedReport.attachments.map((attachment, index: number) => (
                      <div
                        key={index}
                        className="text-sm p-2 bg-accent rounded flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        {attachment.name}
                        <span className="text-xs text-muted-foreground">
                          ({(attachment.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Report ID */}
              <div className="pt-4 border-t">
                <Label className="text-xs text-muted-foreground">Report ID</Label>
                <p className="text-xs font-mono">{selectedReport.id}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setSelectedReport(null)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Support & Encouragement Dialog */}
      <Dialog open={isSupportDialogOpen} onOpenChange={setIsSupportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Heart className="h-6 w-6 text-pink-500" />
              You Are Stronger Than You Know
            </DialogTitle>
            <DialogDescription>
              A message of hope and encouragement for you
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Main Comforting Message */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-base leading-relaxed text-foreground mb-4">
                💜 <strong>You are not alone.</strong> Right now, in this moment, know that your feelings are valid, your experiences matter, and you deserve safety, respect, and peace.
              </p>
              <p className="text-base leading-relaxed text-foreground mb-4">
                🌟 <strong>You are brave.</strong> The fact that you're here, exploring resources and considering reaching out, shows incredible courage. Every small step you take towards healing is a victory worth celebrating.
              </p>
              <p className="text-base leading-relaxed text-foreground">
                🌈 <strong>There is hope.</strong> Things may feel overwhelming right now, but healing is possible. Thousands of people have walked this path before you, and they've found their way to brighter days. You can too.
              </p>
            </div>

            {/* Affirmations */}
            <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Remember These Truths
              </h4>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>What happened to you is not your fault</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>You deserve to be treated with dignity and respect</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Your safety and wellbeing are the top priority</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Asking for help is a sign of strength, not weakness</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>You have the right to set boundaries and protect yourself</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Recovery happens at your own pace - there's no rush</span>
                </li>
              </ul>
            </Card>

            {/* Call to Action */}
            <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Take the Next Step
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                When you're ready, we're here to support you. Whether it's reporting an incident, talking to a trusted contact, or accessing resources - every action you take is progress.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setIsSupportDialogOpen(false);
                    setIsReportOpen(true);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Report Incident
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsSupportDialogOpen(false);
                    navigate("/resources");
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Resources
                </Button>
              </div>
            </Card>

            {/* Emergency Contact Reminder */}
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>
                  <strong>In immediate danger?</strong> Call emergency services (911) or use the emergency button at the top right of your screen.
                </span>
              </p>
            </div>

            {/* Gentle Quote */}
            <div className="text-center pt-2">
              <p className="text-sm italic text-muted-foreground">
                "Healing doesn't mean the damage never existed. It means the damage no longer controls your life."
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                — You are worthy of healing 💜
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsSupportDialogOpen(false)} className="w-full">
              Thank You - I Feel Supported
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
