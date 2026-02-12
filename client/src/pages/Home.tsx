import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { SearchResultCard } from "@/components/SearchResultCard";
import { TermsModal } from "@/components/TermsModal";
import { ApplyModal } from "@/components/ApplyModal";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { Link } from "wouter";

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
    if (searchProfiles.data) {
      if (searchProfiles.data.exact) {
        setSelectedProfile(searchProfiles.data.exact);
      } else if (searchProfiles.data.suggestions && searchProfiles.data.suggestions.length > 0) {
        setSelectedProfile(searchProfiles.data.suggestions[0]);
      } else if (hasSearched) {
        setSelectedProfile(null);
      }
    }
  }, [searchProfiles.data, hasSearched]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Navbar */}
      <Navbar
        onTermsClick={() => setShowTermsModal(true)}
        onApplyClick={() => setShowApplyModal(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            تحقق من موثوقية الأشخاص
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            منصة آمنة وموثوقة للتحقق من حالة الأشخاص والحسابات. ابحث بالاسم أو رابط الحساب للحصول على معلومات فورية
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-16">
          <div className="relative">
            <Input
              type="text"
              placeholder="ابحث بالاسم أو رابط الحساب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg rounded-xl border-2 border-border hover:border-blue-300 focus:border-blue-500 transition-colors w-full"
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
          <div className="max-w-3xl mx-auto mb-16">
            <SearchResultCard
              profile={selectedProfile}
              isLoading={searchProfiles.isLoading}
              suggestions={searchProfiles.data?.suggestions || []}
              error={
                !searchProfiles.isLoading && !selectedProfile && !searchProfiles.data?.suggestions?.length
                  ? "غير معروف"
                  : undefined
              }
            />
          </div>
        )}

        {/* Info Cards */}
        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
            <div className="p-8 rounded-xl bg-card border border-border hover:border-blue-300 transition-colors">
              <div className="w-16 h-16 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-6">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">موثوق</h3>
              <p className="text-muted-foreground">
                أشخاص موثوقون مع عدد دلائل تعاملهم
              </p>
            </div>

            <div className="p-8 rounded-xl bg-card border border-border hover:border-blue-300 transition-colors">
              <div className="w-16 h-16 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-6">
                <span className="text-3xl">⚠</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">نصاب</h3>
              <p className="text-muted-foreground">
                تحذيرات من أشخاص نصابين
              </p>
            </div>

            <div className="p-8 rounded-xl bg-card border border-border hover:border-blue-300 transition-colors">
              <div className="w-16 h-16 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center mb-6">
                <span className="text-3xl">?</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">غير معروف</h3>
              <p className="text-muted-foreground">
                أشخاص غير موجودين في قوائمنا
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">الروابط الرئيسية</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/" className="hover:text-foreground transition-colors">الرئيسية</a>
                </li>
                <li>
                  <a href="/verified" className="hover:text-foreground transition-colors">الموثوقون</a>
                </li>
                <li>
                  <a href="/scammers" className="hover:text-foreground transition-colors">المحتالون</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">المعلومات</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/statistics" className="hover:text-foreground transition-colors">الإحصائيات</a>
                </li>
                <li>
                  <a href="/about" className="hover:text-foreground transition-colors">حول المنصة</a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-foreground transition-colors">الأسئلة الشائعة</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">الإجراءات</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/report" className="hover:text-foreground transition-colors">إبلاغ عن محتال</a>
                </li>
                <li>
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="hover:text-foreground transition-colors"
                  >
                    طلب الانضمام
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026 CrediFy. جميع الحقوق محفوظة
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                شروط الاستخدام
              </a>
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
