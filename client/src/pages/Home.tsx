import { useState, useEffect } from "react";
import { Search, Info, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { SearchResultCard } from "@/components/SearchResultCard";
import { TermsModal } from "@/components/TermsModal";
import { ApplyModal } from "@/components/ApplyModal";
import { toast } from "sonner";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchProfiles = trpc.profiles.search.useQuery(
    { query: searchQuery },
    { enabled: false, staleTime: 0 }
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("الرجاء إدخال اسم أو رابط للبحث");
      return;
    }
    setHasSearched(true);
    setSelectedProfile(null);
    await searchProfiles.refetch();
  };

  useEffect(() => {
    if (searchProfiles.data && searchProfiles.data.length > 0) {
      setSelectedProfile(searchProfiles.data[0]);
    } else if (hasSearched && searchProfiles.data?.length === 0) {
      setSelectedProfile(null);
    }
  }, [searchProfiles.data, hasSearched]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">RPS</span>
            </div>
            <h1 className="text-xl font-bold">منصة التحقق</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTermsModal(true)}
            className="gap-2"
          >
            <Info className="w-4 h-4" />
            الشروط
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-12 md:py-20">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            تحقق من موثوقية الأشخاص
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            منصة آمنة وموثوقة للتحقق من حالة الأشخاص والحسابات. ابحث بالاسم أو رابط الحساب للحصول على معلومات فورية
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Input
              type="text"
              placeholder="ابحث بالاسم أو رابط الحساب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg rounded-xl border-2 border-border hover:border-blue-300 focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <SearchResultCard
            profile={selectedProfile}
            isLoading={searchProfiles.isLoading}
            error={
              !searchProfiles.isLoading && !selectedProfile
                ? "غير معروف"
                : undefined
            }
          />
        )}

        {/* Info Cards */}
        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16">
            <div className="p-6 rounded-xl bg-card border border-border hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4">
                <span className="text-xl">✓</span>
              </div>
              <h3 className="font-semibold mb-2">موثوق</h3>
              <p className="text-sm text-muted-foreground">
                أشخاص موثوقون مع عدد دلائل تعاملهم
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <span className="text-xl">⚠</span>
              </div>
              <h3 className="font-semibold mb-2">نصاب</h3>
              <p className="text-sm text-muted-foreground">
                تحذيرات من أشخاص نصابين
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center mb-4">
                <span className="text-xl">?</span>
              </div>
              <h3 className="font-semibold mb-2">غير معروف</h3>
              <p className="text-sm text-muted-foreground">
                أشخاص غير موجودين في قوائمنا
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026 منصة التحقق من الموثوقين. جميع الحقوق محفوظة
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a href="/statistics" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                الإحصائيات
              </a>
              <span className="text-gray-300">•</span>
              <a href="/report" className="text-sm text-red-600 hover:text-red-700 font-medium">
                إبلاغ عن محتال
              </a>
              <span className="text-gray-300">•</span>
              <Button
                onClick={() => setShowApplyModal(true)}
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 h-auto p-0 font-medium"
              >
                تقديم طلب
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <ApplyModal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} />
    </div>
  );
}
