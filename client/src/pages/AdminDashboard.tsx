import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, AlertCircle, MessageSquare, Settings, LogOut, TrendingUp, Shield, XCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      setLocation("/");
      return;
    }
    if (user.role !== "admin") {
      toast.error("Access denied. Admin only.");
      setLocation("/");
    }
  }, [user, setLocation]);

  // Fetch statistics - using profiles search which includes stats
  const { data: statsData } = trpc.profiles.search.useQuery({ query: "" });
  const { data: reports, isLoading: reportsLoading } = trpc.reports.getAll.useQuery();
  const { data: appeals, isLoading: appealsLoading } = trpc.appeals.getAll.useQuery();
  const { data: profiles, isLoading: profilesLoading } = trpc.profiles.getAll.useQuery();

  if (!user || user.role !== "admin") {
    return null;
  }

  const defaultStats = {
    trustedCount: 0,
    scammerCount: 0,
    suspiciousCount: 0,
    totalProfiles: 0,
    verifiedCount: 0,
    topSellersCount: 0,
    middlemenCount: 0,
  };

  // Calculate stats from profiles
  const trustedCount = profiles?.filter(p => p.status === "trusted").length || 0;
  const scammerCount = profiles?.filter(p => p.status === "scammer").length || 0;
  const suspiciousCount = profiles?.filter(p => p.status === "suspicious").length || 0;
  const verifiedCount = profiles?.filter(p => p.rank === "verified").length || 0;
  const topSellersCount = profiles?.filter(p => p.rank === "top_seller").length || 0;
  const middlemenCount = profiles?.filter(p => p.rank === "middleman").length || 0;

  const chartData = [
    { name: "Trusted", value: trustedCount, fill: "#10b981" },
    { name: "Scammers", value: scammerCount, fill: "#ef4444" },
    { name: "Suspicious", value: suspiciousCount, fill: "#f59e0b" },
  ];

  const rankData = [
    { name: "Verified", value: verifiedCount },
    { name: "Top Sellers", value: topSellersCount },
    { name: "Middlemen", value: middlemenCount },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-2">Welcome back, {user.name}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              logout();
              setLocation("/");
            }}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Trusted Profiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{trustedCount}</p>
              <p className="text-xs text-slate-500 mt-1">Verified members</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                Scammers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{scammerCount}</p>
              <p className="text-xs text-slate-500 mt-1">Reported fraudsters</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                Suspicious
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{suspiciousCount}</p>
              <p className="text-xs text-slate-500 mt-1">Under review</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Total Profiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{profiles?.length || 0}</p>
              <p className="text-xs text-slate-500 mt-1">All registered</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="appeals">Appeals</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Status Distribution</CardTitle>
                  <CardDescription>Breakdown of all profiles by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rank Distribution</CardTitle>
                  <CardDescription>Members by rank and badge level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={rankData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profiles Tab */}
          <TabsContent value="profiles">
            <Card>
              <CardHeader>
                <CardTitle>All Profiles</CardTitle>
                <CardDescription>Manage all registered profiles</CardDescription>
              </CardHeader>
              <CardContent>
                {profilesLoading ? (
                  <p className="text-slate-500">Loading profiles...</p>
                ) : profiles && profiles.length > 0 ? (
                  <div className="space-y-4">
                    {profiles.map((profile) => (
                      <div key={profile.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-slate-50">
                        <div>
                          <p className="font-semibold text-slate-900">{profile.name}</p>
                          <p className="text-sm text-slate-600">{profile.profileLink}</p>
                          <div className="flex gap-2 mt-2">
                            <span className={`px-2 py-1 text-xs rounded font-semibold ${
                              profile.status === "trusted" ? "bg-green-100 text-green-800" :
                              profile.status === "scammer" ? "bg-red-100 text-red-800" :
                              profile.status === "suspicious" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {profile.status}
                            </span>
                            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 font-semibold">
                              {profile.rank}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">{profile.proofCount} proofs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No profiles found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Reports</CardTitle>
                <CardDescription>Manage reported scammers and fraud cases</CardDescription>
              </CardHeader>
              <CardContent>
                {reportsLoading ? (
                  <p className="text-slate-500">Loading reports...</p>
                ) : reports && reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className="p-4 border rounded-lg hover:bg-slate-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-slate-900">{report.scammerName}</p>
                            <p className="text-sm text-slate-600">{report.description}</p>
                            <p className="text-xs text-slate-500 mt-2">Reported by: {report.reporterName}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs rounded font-semibold ${
                            report.status === "verified" ? "bg-green-100 text-green-800" :
                            report.status === "rejected" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {report.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No reports found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appeals Tab */}
          <TabsContent value="appeals">
            <Card>
              <CardHeader>
                <CardTitle>Appeals</CardTitle>
                <CardDescription>Manage appeals from scammers</CardDescription>
              </CardHeader>
              <CardContent>
                {appealsLoading ? (
                  <p className="text-slate-500">Loading appeals...</p>
                ) : appeals && appeals.length > 0 ? (
                  <div className="space-y-4">
                    {appeals.map((appeal) => (
                      <div key={appeal.id} className="p-4 border rounded-lg hover:bg-slate-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-slate-900">{appeal.name}</p>
                            <p className="text-sm text-slate-600">{appeal.message}</p>
                            <p className="text-xs text-slate-500 mt-2">Email: {appeal.email}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs rounded font-semibold ${
                            appeal.status === "approved" ? "bg-green-100 text-green-800" :
                            appeal.status === "rejected" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {appeal.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No appeals found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Configure site appearance and behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Settings page coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
