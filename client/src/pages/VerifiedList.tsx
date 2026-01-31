import { useState, useMemo } from "react";
import { Search, Filter, TrendingUp, Award, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/Badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function VerifiedList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "proofs" | "recent">("recent");
  const [filterRank, setFilterRank] = useState<"all" | "verified" | "top_seller" | "middleman">("all");

  const { data: profiles = [], isLoading } = trpc.profiles.getAll.useQuery();

  const verifiedProfiles = useMemo(() => {
    return profiles
      .filter((p) => p.status === "trusted")
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((p) => {
        if (filterRank === "all") return true;
        const rankMap: Record<string, string> = {
          topSeller: "top_seller",
          middleman: "middleman",
          verified: "verified",
        };
        return p.rank === rankMap[filterRank];
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name, "ar");
        } else if (sortBy === "proofs") {
          return (b.proofCount || 0) - (a.proofCount || 0);
        } else {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [profiles, searchQuery, sortBy, filterRank]);

  const stats = {
    total: verifiedProfiles.length,
    topSellers: verifiedProfiles.filter((p) => p.rank === "top_seller").length,
    middlemen: verifiedProfiles.filter((p) => p.rank === "middleman").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الموثوقين</p>
                  <p className="text-3xl font-bold mt-2">{stats.total}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">بائعون مميزون</p>
                  <p className="text-3xl font-bold mt-2">{stats.topSellers}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">وسطاء معتمدون</p>
                  <p className="text-3xl font-bold mt-2">{stats.middlemen}</p>
                </div>
                <Award className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث بالاسم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={filterRank}
                onChange={(e) => setFilterRank(e.target.value as "all" | "verified" | "top_seller" | "middleman")}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                <option value="all">جميع الرتب</option>
                <option value="verified">موثوق</option>
                <option value="top_seller">بائع مميز</option>
                <option value="middleman">وسيط معتمد</option>
              </select>
            </div>

            <div className="relative">
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                <option value="recent">الأحدث</option>
                <option value="proofs">الأكثر دلائل</option>
                <option value="name">ترتيب أبجدي</option>
              </select>
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        ) : verifiedProfiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">لم يتم العثور على نتائج</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verifiedProfiles.map((profile) => (
              <Card key={profile.id} className="hover:border-blue-300 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{profile.name}</h3>
                      {profile.rank && <Badge rank={profile.rank as "verified" | "top_seller" | "middleman"} />}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">رابط الحساب</p>
                      <a
                        href={profile.profileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate block"
                      >
                        {profile.profileLink}
                      </a>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">عدد الدلائل</p>
                        <p className="text-2xl font-bold text-green-600">{profile.proofCount}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">الحالة</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-3 h-3 rounded-full bg-green-600"></div>
                          <span className="text-sm font-medium">موثوق</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground">
                      تم الإضافة: {new Date(profile.createdAt).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              ← العودة للرئيسية
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
