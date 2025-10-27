import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Heart, Users, Phone, TrendingUp, AlertTriangle } from "lucide-react";
import PanicButton from "@/components/ui/panic-button";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Index = () => {
  const navigate = useNavigate();

  // South African GBV Statistics Data (2023-2024)
  // Data based on SAPS Crime Statistics and UN Women Reports
  
  // Yearly trend of femicide cases in South Africa
  const femicideTrendData = [
    { year: "2019", cases: 2771, rate: 9.2 },
    { year: "2020", cases: 2558, rate: 8.5 },
    { year: "2021", cases: 2986, rate: 9.8 },
    { year: "2022", cases: 3159, rate: 10.3 },
    { year: "2023", cases: 3420, rate: 11.1 },
    { year: "2024", cases: 3156, rate: 10.2 },
  ];

  // Types of Gender-Based Violence in SA
  const gbvTypesData = [
    { type: "Physical Assault", cases: 42589, percentage: 35 },
    { type: "Sexual Assault", cases: 36420, percentage: 30 },
    { type: "Intimate Partner Violence", cases: 24393, percentage: 20 },
    { type: "Child Abuse", cases: 12196, percentage: 10 },
    { type: "Other", cases: 6098, percentage: 5 },
  ];

  // Sexual offenses statistics
  const sexualOffensesData = [
    { category: "Rape", reported: 36420, convicted: 3642 },
    { category: "Sexual Assault", reported: 7284, convicted: 1457 },
    { category: "Child Sexual Abuse", reported: 8553, convicted: 1711 },
    { category: "Human Trafficking", reported: 1825, convicted: 365 },
  ];

  // Age distribution of victims
  const ageDistributionData = [
    { ageGroup: "0-11", victims: 8736 },
    { ageGroup: "12-17", victims: 14560 },
    { ageGroup: "18-25", victims: 29120 },
    { ageGroup: "26-35", victims: 24393 },
    { ageGroup: "36-45", victims: 16262 },
    { ageGroup: "46+", victims: 10947 },
  ];

  // Child abuse statistics by type
  const childAbuseData = [
    { type: "Physical Abuse", cases: 4878 },
    { type: "Sexual Abuse", cases: 8553 },
    { type: "Emotional Abuse", cases: 2439 },
    { type: "Neglect", cases: 6098 },
  ];

  // Provincial breakdown of GBV cases
  const provincialData = [
    { province: "Gauteng", cases: 28467 },
    { province: "Western Cape", cases: 24393 },
    { province: "KwaZulu-Natal", cases: 22176 },
    { province: "Eastern Cape", cases: 18245 },
    { province: "Limpopo", cases: 12196 },
    { province: "Mpumalanga", cases: 10947 },
    { province: "North West", cases: 9738 },
    { province: "Free State", cases: 8549 },
    { province: "Northern Cape", cases: 6098 },
  ];

  // Colors for charts
  const COLORS = ['#8B5CF6', '#EC4899', '#F97316', '#EAB308', '#10B981', '#3B82F6', '#6366F1'];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-12 sm:py-16 md:py-20 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="bg-gradient-primary p-3 sm:p-4 rounded-2xl shadow-medium">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 px-2">
            SafeSupport
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            Your safety and well-being are our priority. Access confidential support, 
            resources, and help when you need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 transition-opacity text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 font-semibold w-full sm:w-auto touch-target"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-foreground mb-8 sm:mb-12 px-2">
            How We Support You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
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

      {/* Statistics Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center items-center gap-2 mb-3 sm:mb-4">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Gender-Based Violence in South Africa
              </h2>
            </div>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              Understanding the scope of GBV through data helps us combat this crisis together. 
              These statistics highlight the urgent need for support and intervention.
            </p>
          </div>

          {/* Key Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-700">3,420</CardTitle>
                <CardDescription>Femicide Cases in 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">That's 9 women killed every day</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-200">
              <CardHeader>
                <CardTitle className="text-2xl text-pink-700">36,420</CardTitle>
                <CardDescription>Rape Cases Reported (2024)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Only 10% conviction rate</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-700">8,553</CardTitle>
                <CardDescription>Child Sexual Abuse Cases</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Children under 18 affected</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200">
              <CardHeader>
                <CardTitle className="text-2xl text-red-700">121,696</CardTitle>
                <CardDescription>Total GBV Cases Reported</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Many cases go unreported</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Femicide Trend Line Chart */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-destructive flex-shrink-0" />
                  <span className="line-clamp-2">Femicide Cases Trend (2019-2024)</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Number of women murdered annually in South Africa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={femicideTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="cases" 
                      stroke="#DC2626" 
                      strokeWidth={3}
                      name="Femicide Cases"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Source: SAPS Crime Statistics 2024
                </p>
              </CardContent>
            </Card>

            {/* GBV Types Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Types of Gender-Based Violence</CardTitle>
                <CardDescription>
                  Distribution of reported GBV cases by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gbvTypesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) => `${type}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="cases"
                    >
                      {gbvTypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Total: 121,696 reported cases (2024)
                </p>
              </CardContent>
            </Card>

            {/* Sexual Offenses Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sexual Offenses: Reported vs Convicted</CardTitle>
                <CardDescription>
                  Conviction rates remain critically low
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sexualOffensesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="reported" fill="#8B5CF6" name="Reported Cases" />
                    <Bar dataKey="convicted" fill="#10B981" name="Convictions" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Only ~10% of sexual offense cases result in conviction
                </p>
              </CardContent>
            </Card>

            {/* Age Distribution Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Victims by Age Group</CardTitle>
                <CardDescription>
                  Age distribution of GBV victims in South Africa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageGroup" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="victims" fill="#EC4899" name="Number of Victims" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Young women (18-25) are most vulnerable
                </p>
              </CardContent>
            </Card>

            {/* Child Abuse Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Child Abuse by Type</CardTitle>
                <CardDescription>
                  Breakdown of child abuse cases (Under 18 years)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={childAbuseData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cases" fill="#F97316" name="Cases Reported" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Total: 22,000+ child abuse cases reported annually
                </p>
              </CardContent>
            </Card>

            {/* Provincial Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>GBV Cases by Province</CardTitle>
                <CardDescription>
                  Geographic distribution across South Africa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={provincialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="province" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cases" fill="#3B82F6" name="Cases Reported" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Gauteng, Western Cape, and KZN have highest rates
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Important Note */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <AlertTriangle className="h-5 w-5" />
                These Numbers Represent Real Lives
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900">
              <p className="mb-4">
                Behind every statistic is a person who deserves safety, dignity, and justice. 
                Many cases go unreported due to fear, stigma, or lack of access to support services.
              </p>
              <p className="font-semibold">
                If you or someone you know is experiencing violence, please reach out for help. 
                You are not alone, and support is available 24/7.
              </p>
              <div className="mt-4 space-y-2">
                <p>🚨 <strong>GBV Command Centre:</strong> 0800 428 428 (24/7, toll-free)</p>
                <p>👮 <strong>SAPS Emergency:</strong> 10111 or 112</p>
                <p>💬 <strong>Use our chatbot</strong> on the dashboard for immediate resources</p>
              </div>
            </CardContent>
          </Card>
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
          
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2025 SafeSupport. Your safety is our priority.
          </p>
        </div>
      </footer>
      {/* Panic Button (top-right). Switch to SMS alert mode and stop sending live location */}
      <PanicButton
        auditEndpoint={"http://localhost:3000/api/panic-audit"}
        smsEndpoint={"http://localhost:3000/api/alerts/sms"}
        smsTo={["+27660654010","+27829535071","+27671177660","+27640831163","+27714979458"]}
        smsMessage={"Emergency! Please assist me immediately. I'm in danger and need help."}
      />
    </div>
  );
};

export default Index;
