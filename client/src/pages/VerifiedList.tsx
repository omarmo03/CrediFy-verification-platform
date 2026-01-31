import { useState, useMemo } from "react";
import { Search, Filter, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/Badge";
import { trpc } from "@/lib/trpc";

export default function VerifiedList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "proofs" | "recent">("recent");

  const { data: profiles = [], isLoading } = trpc.profiles.getAll.useQuery();

  const verifiedProfiles = useMemo(() => {
    return profiles
      .filter((p) => p.status === "trusted")
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name, "ar");
        } else if (sortBy === "proofs") {
          return (b.proofCount || 0) - (a.proofCount || 0);
        } else {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [profiles, searchQuery, sortBy]);

  const stats = {
    total: verifiedProfiles.length,
    topSellers: verifiedProfiles.filter((p) => p.rank === "top_seller").length,
    middlemen: verifiedProfiles.filter((p) => p.rank === "middleman").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">قائمة الموثوقين</h1>
              <p className="text-sm text-muted-foreground mt-1">
                اكتشف الحسابات الموثوقة والموثوق بها
              </p>
            </div>
            <Award className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.total}</div>
                <p className="text-sm text-muted-foreground mt-1">حساب موثوق</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{stats.topSellers}</div>
                <p className="text-sm text-muted-foreground mt-1">بائع مميز</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.middlemen}</div>
                <p className="text-sm text-muted-foreground mt-1">وسيط معتمد</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث عن حساب موثوق..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={sortBy === "recent" ? "default" : "outline"}
              onClick={() => setSortBy("recent")}
              size="sm"
            >
              الأحدث
            </Button>
            <Button
              variant={sortBy === "proofs" ? "default" : "outline"}
              onClick={() => setSortBy("proofs")}
              size="sm"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              الأكثر دلائل
            </Button>
            <Button
              variant={sortBy === "name" ? "default" : "outline"}
              onClick={() => setSortBy("name")}
              size="sm"
            >
              الاسم (أ-ي)
            </Button>
          </div>
        </div>

        {/* Profiles Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        ) : verifiedProfiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لم يتم العثور على نتائج</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {verifiedProfiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{profile.name}</h3>
                      <a
                        href={profile.profileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate block"
                      >
                        زيارة الحساب
                      </a>
                    </div>
                    <Badge rank={profile.rank || "verified"} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">عدد الدلائل:</span>
                      <span className="font-semibold text-foreground">{profile.proofCount || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">تاريخ الإضافة:</span>
                      <span className="font-semibold text-foreground">
                        {new Date(profile.createdAt).toLocaleDateString("ar-EG")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
