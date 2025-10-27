import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Scale, 
  Heart, 
  Home, 
  DollarSign, 
  BookOpen, 
  Users, 
  Search,
  Star,
  Globe,
  AlertCircle,
  LogOut
} from "lucide-react";

const Resources = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const crisisResources = [
    {
      id: "crisis-1",
      name: "GBV Command Centre",
      phone: "0800 428 428",
      description: "24/7 national crisis hotline for gender-based violence in South Africa",
      available: "24/7",
      languages: "11 official SA languages",
      hasChat: false,
      website: "https://www.gbv.org.za"
    },
    {
      id: "crisis-2",
      name: "South African Police Service (SAPS)",
      phone: "10111",
      description: "Emergency police services - report crime and get immediate assistance",
      available: "24/7",
      languages: "All SA languages",
      hasChat: false,
      website: "https://www.saps.gov.za"
    },
    {
      id: "crisis-3",
      name: "Rape Crisis Cape Town Trust",
      phone: "021 447 9762",
      description: "Counseling and support for rape and sexual assault survivors",
      available: "Office hours: 9am-5pm weekdays",
      languages: "English, Afrikaans, Xhosa",
      hasChat: false,
      website: "https://rapecrisis.org.za"
    },
    {
      id: "crisis-4",
      name: "Lifeline South Africa",
      phone: "0861 322 322",
      description: "Crisis counseling and suicide prevention support",
      available: "24/7",
      languages: "English, Afrikaans",
      hasChat: false,
      website: "https://www.lifeline.org.za"
    },
    {
      id: "crisis-5",
      name: "POWA (People Opposing Women Abuse)",
      phone: "011 642 4345",
      description: "Support and counseling for abused women and children",
      available: "Mon-Fri: 8am-4pm",
      languages: "English, Zulu, Sotho",
      hasChat: false,
      website: "https://www.powa.co.za"
    }
  ];

  const legalResources = [
    {
      id: "legal-1",
      title: "Legal Aid South Africa",
      description: "Free legal assistance for those who cannot afford a lawyer",
      category: "Services",
      website: "https://www.legal-aid.co.za",
      phone: "0800 110 110"
    },
    {
      id: "legal-2",
      title: "Tshwaranang Legal Advocacy Centre",
      description: "Legal services for women experiencing violence in Gauteng",
      category: "Services",
      website: "https://www.tlac.org.za",
      phone: "011 403 4267"
    },
    {
      id: "legal-3",
      title: "Domestic Violence Act Guide",
      description: "Understanding protection orders and your rights under SA law",
      category: "Guide",
      website: "https://www.justice.gov.za"
    },
    {
      id: "legal-4",
      title: "Commission for Gender Equality",
      description: "Report gender discrimination and get support",
      category: "Services",
      website: "https://www.cge.org.za",
      phone: "011 403 7182"
    }
  ];

  const mentalHealthResources = [
    {
      id: "mental-1",
      title: "SADAG (Depression & Anxiety)",
      description: "South African Depression and Anxiety Group - free counseling",
      icon: Heart,
      website: "https://www.sadag.org",
      phone: "0800 567 567"
    },
    {
      id: "mental-2",
      title: "Trauma Centre for Survivors of Violence",
      description: "Specialized trauma counseling in Cape Town",
      icon: Users,
      website: "https://www.trauma.org.za",
      phone: "021 465 7373"
    },
    {
      id: "mental-3",
      title: "Childline South Africa",
      description: "Counseling for children and families affected by abuse",
      icon: BookOpen,
      website: "https://www.childlinesa.org.za",
      phone: "0800 055 555"
    },
    {
      id: "mental-4",
      title: "FAMSA (Family Counseling)",
      description: "Family and marriage counseling services nationwide",
      icon: Heart,
      website: "https://www.famsa.org.za",
      phone: "011 975 7106"
    }
  ];

  const practicalSupport = [
    {
      id: "practical-1",
      title: "Nicro (Safe Houses)",
      description: "Emergency shelters for women and children escaping abuse",
      icon: Home,
      hasMap: true,
      website: "https://www.nicro.org.za",
      phone: "0800 006 428"
    },
    {
      id: "practical-2",
      title: "SASSA (Social Grants)",
      description: "Social assistance and emergency financial support",
      icon: DollarSign,
      hasMap: false,
      website: "https://www.sassa.gov.za",
      phone: "0800 601 011"
    },
    {
      id: "practical-3",
      title: "FETColleges & Skills Training",
      description: "Free vocational training and job placement programs",
      icon: BookOpen,
      hasMap: false,
      website: "https://www.dhet.gov.za"
    },
    {
      id: "practical-4",
      title: "Department of Social Development",
      description: "Victim support services and family care resources",
      icon: Users,
      hasMap: true,
      website: "https://www.dsd.gov.za",
      phone: "0800 220 250"
    }
  ];

  const quickExitHandler = () => {
    window.location.replace("https://www.google.com");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Quick Exit Button */}
      <Button
        onClick={quickExitHandler}
        variant="destructive"
        size="sm"
        className="fixed top-16 sm:top-4 right-3 sm:right-4 z-50 gap-1.5 sm:gap-2 animate-fade-in h-9 sm:h-8 px-3 text-xs sm:text-sm safe-top safe-right touch-target"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden xs:inline sm:inline">Quick Exit</span>
        <span className="xs:hidden sm:hidden">Exit</span>
      </Button>

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40 safe-top">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-2 sm:gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="touch-target flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">Safety Resources</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Comprehensive support when you need it</p>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 sm:h-10"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 pb-16 sm:pb-12 safe-bottom">
        <Tabs defaultValue="crisis" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 sm:gap-2 h-auto p-1">
            <TabsTrigger value="crisis" className="text-xs sm:text-sm py-2 touch-target">Crisis Support</TabsTrigger>
            <TabsTrigger value="legal" className="text-xs sm:text-sm py-2 touch-target">Legal</TabsTrigger>
            <TabsTrigger value="mental" className="text-xs sm:text-sm py-2 touch-target">Mental Health</TabsTrigger>
            <TabsTrigger value="practical" className="text-xs sm:text-sm py-2 touch-target">Practical</TabsTrigger>
            <TabsTrigger value="community" className="text-xs sm:text-sm py-2 touch-target">Community</TabsTrigger>
          </TabsList>

          {/* Crisis Support Tab */}
          <TabsContent value="crisis" className="space-y-4 sm:space-y-6 animate-fade-in">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 sm:p-4 flex gap-2 sm:gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1">In Immediate Danger?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                  Call <a href="tel:10111" className="font-bold text-destructive hover:underline">10111</a> (SAPS Emergency) or <a href="tel:112" className="font-bold text-destructive hover:underline">112</a> (from mobile) immediately. Your safety is the priority.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {crisisResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-medium transition-shadow animate-scale-in">
                  <CardHeader className="pb-3 sm:pb-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {resource.name}
                        </CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(resource.id)}
                      >
                        <Star className={`h-4 w-4 ${favorites.includes(resource.id) ? 'fill-primary text-primary' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <a href={`tel:${resource.phone}`} className="text-primary font-semibold hover:underline">
                        {resource.phone}
                      </a>
                    </div>
                    {resource.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <a 
                          href={resource.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary text-sm hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="outline" className="gap-1">
                        <Globe className="h-3 w-3" />
                        {resource.languages}
                      </Badge>
                      <span>{resource.available}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Legal Resources Tab */}
          <TabsContent value="legal" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-4">
              {legalResources.map((resource) => (
                <Card 
                  key={resource.id} 
                  className="hover:shadow-medium transition-shadow cursor-pointer animate-scale-in"
                  onClick={() => resource.website && window.open(resource.website, '_blank', 'noopener,noreferrer')}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Scale className="h-5 w-5 text-primary" />
                          {resource.title}
                        </CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(resource.id);
                        }}
                      >
                        <Star className={`h-4 w-4 ${favorites.includes(resource.id) ? 'fill-primary text-primary' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{resource.category}</Badge>
                    </div>
                    {resource.phone && (
                      <div className="flex items-center gap-2 pt-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <a 
                          href={`tel:${resource.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-primary text-sm hover:underline"
                        >
                          {resource.phone}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Mental Health Tab */}
          <TabsContent value="mental" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-4">
              {mentalHealthResources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <Card 
                    key={resource.id} 
                    className="hover:shadow-medium transition-shadow cursor-pointer animate-scale-in"
                    onClick={() => resource.website && window.open(resource.website, '_blank', 'noopener,noreferrer')}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Icon className="h-5 w-5 text-secondary" />
                            {resource.title}
                          </CardTitle>
                          <CardDescription>{resource.description}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(resource.id);
                          }}
                        >
                          <Star className={`h-4 w-4 ${favorites.includes(resource.id) ? 'fill-primary text-primary' : ''}`} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {resource.phone && (
                        <div className="flex items-center gap-2 pt-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <a 
                            href={`tel:${resource.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-primary text-sm hover:underline"
                          >
                            {resource.phone}
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Practical Support Tab */}
          <TabsContent value="practical" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-4">
              {practicalSupport.map((resource) => {
                const Icon = resource.icon;
                return (
                  <Card 
                    key={resource.id} 
                    className="hover:shadow-medium transition-shadow cursor-pointer animate-scale-in"
                    onClick={() => resource.website && window.open(resource.website, '_blank', 'noopener,noreferrer')}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Icon className="h-5 w-5 text-success" />
                            {resource.title}
                          </CardTitle>
                          <CardDescription>{resource.description}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(resource.id);
                          }}
                        >
                          <Star className={`h-4 w-4 ${favorites.includes(resource.id) ? 'fill-primary text-primary' : ''}`} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {resource.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <a 
                            href={`tel:${resource.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-primary text-sm hover:underline"
                          >
                            {resource.phone}
                          </a>
                        </div>
                      )}
                      {resource.hasMap && resource.website && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(resource.website, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          <MapPin className="h-4 w-4" />
                          Visit Website
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Community Resources Tab */}
          <TabsContent value="community" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Support Groups & Communities
                </CardTitle>
                <CardDescription>
                  Connect with others who understand your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Women For Change</h4>
                  <p className="text-sm text-muted-foreground">
                    Support groups for women survivors of violence across South Africa
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://www.womenforchange.co.za', '_blank', 'noopener,noreferrer')}
                  >
                    Visit Website
                  </Button>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Soul City Institute</h4>
                  <p className="text-sm text-muted-foreground">
                    Community programs and support for GBV survivors
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://www.soulcity.org.za', '_blank', 'noopener,noreferrer')}
                  >
                    Visit Website
                  </Button>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Sonke Gender Justice</h4>
                  <p className="text-sm text-muted-foreground">
                    Working to prevent gender-based violence in communities
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://www.genderjustice.org.za', '_blank', 'noopener,noreferrer')}
                  >
                    Visit Website
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-secondary" />
                  Educational Resources
                </CardTitle>
                <CardDescription>
                  Learn about healthy relationships and safety planning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/5 cursor-pointer"
                  onClick={() => window.open('https://www.justice.gov.za/vg/gbv.html', '_blank', 'noopener,noreferrer')}
                >
                  <div>
                    <p className="font-medium">SA Department of Justice GBV Resources</p>
                    <p className="text-sm text-muted-foreground">Understanding your rights and available support</p>
                  </div>
                </div>
                <div 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/5 cursor-pointer"
                  onClick={() => window.open('https://www.gbv.org.za/safety-plan', '_blank', 'noopener,noreferrer')}
                >
                  <div>
                    <p className="font-medium">Safety Planning Toolkit</p>
                    <p className="text-sm text-muted-foreground">Create your personalized safety plan</p>
                  </div>
                </div>
                <div 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/5 cursor-pointer"
                  onClick={() => window.open('https://www.powa.co.za/resources', '_blank', 'noopener,noreferrer')}
                >
                  <div>
                    <p className="font-medium">Digital Safety Guide</p>
                    <p className="text-sm text-muted-foreground">Protect your privacy and data from abuse</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <Card className="mt-6 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-primary text-primary" />
                Your Saved Resources ({favorites.length})
              </CardTitle>
              <CardDescription>
                Quick access to your most important resources
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Resources;