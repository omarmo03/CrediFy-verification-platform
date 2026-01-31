import { useState, useMemo } from "react";
import { Search, AlertTriangle, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function ScammersList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "recent">("recent");

  const { data: profiles = [], isLoading } = trpc.profiles.getAll.useQuery();

  const scammers = useMemo(() => {
    return profiles
      .filter((p) => p.status === "scammer")
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name, "ar");
        } else {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [profiles, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">قائمة المحتالين</h1>
              <p className="text-sm text-muted-foreground mt-1">
                احذر من هذه الحسابات المريبة والمحتالة
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Warning Banner */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">تحذير مهم</h3>
                <p className="text-sm text-red-800 mt-1">
                  تجنب التعامل مع الحسابات المدرجة هنا. إذا تعاملت مع أحدهم، يرجى الإبلاغ عنه فوراً.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600">{scammers.length}</div>
              <p className="text-sm text-muted-foreground mt-1">حساب محتال مسجل</p>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث عن حساب محتال..."
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
              variant={sortBy === "name" ? "default" : "outline"}
              onClick={() => setSortBy("name")}
              size="sm"
            >
              الاسم (أ-ي)
            </Button>
          </div>
        </div>

        {/* Scammers List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        ) : scammers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لم يتم العثور على نتائج</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scammers.map((scammer) => (
              <Card key={scammer.id} className="border-red-200 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h3 className="font-semibold text-foreground text-lg">{scammer.name}</h3>
                      </div>
                      <a
                        href={scammer.profileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline break-all"
                      >
                        {scammer.profileLink}
                      </a>
                      <p className="text-xs text-muted-foreground mt-2">
                        تم الإضافة: {new Date(scammer.createdAt).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                    <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap mr-4">
                      محتال
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
