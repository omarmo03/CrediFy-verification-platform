import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, HelpCircle, TrendingUp } from "lucide-react";
import { useMemo } from "react";

export default function Statistics() {
  const { data: allProfiles = [] } = trpc.profiles.getAll.useQuery();

  const stats = useMemo(() => {
    const trusted = allProfiles.filter((p) => p.status === "trusted").length;
    const scammers = allProfiles.filter((p) => p.status === "scammer").length;
    const unknown = allProfiles.filter((p) => p.status === "not_found").length;
    const total = allProfiles.length;

    const topSellers = allProfiles.filter((p) => p.rank === "top_seller").length;
    const middlemen = allProfiles.filter((p) => p.rank === "middleman").length;

    const totalProofs = allProfiles.reduce((sum, p) => sum + (p.proofCount || 0), 0);
    const avgProofs = total > 0 ? Math.round(totalProofs / total) : 0;

    return {
      trusted,
      scammers,
      unknown,
      total,
      topSellers,
      middlemen,
      totalProofs,
      avgProofs,
    };
  }, [allProfiles]);

  const trustPercentage = stats.total > 0 ? Math.round((stats.trusted / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">إحصائيات المنصة</h1>
          <p className="text-gray-600">نظرة عامة على حالة المجتمع والموثوقية</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Profiles */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                إجمالي الحسابات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">حساب مسجل</p>
            </CardContent>
          </Card>

          {/* Trusted Users */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                الموثوقون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.trusted}</div>
              <p className="text-xs text-gray-500 mt-1">{trustPercentage}% من الحسابات</p>
            </CardContent>
          </Card>

          {/* Scammers */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                المحتالون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.scammers}</div>
              <p className="text-xs text-gray-500 mt-1">حساب مريب</p>
            </CardContent>
          </Card>

          {/* Unknown */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                غير معروفة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">{stats.unknown}</div>
              <p className="text-xs text-gray-500 mt-1">حساب لم يتم التحقق منه</p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Sellers */}
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
              <CardTitle className="text-sm font-medium text-yellow-700">بائعون مميزون</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-yellow-600 mb-2">{stats.topSellers}</div>
              <p className="text-xs text-gray-600">حساب برتبة بائع مميز</p>
            </CardContent>
          </Card>

          {/* Middlemen */}
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-sm font-medium text-blue-700">وسطاء معتمدون</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.middlemen}</div>
              <p className="text-xs text-gray-600">حساب برتبة وسيط معتمد</p>
            </CardContent>
          </Card>

          {/* Proofs */}
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="text-sm font-medium text-purple-700">الأدلة</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.totalProofs}</div>
              <p className="text-xs text-gray-600">متوسط {stats.avgProofs} دليل لكل حساب</p>
            </CardContent>
          </Card>
        </div>

        {/* Trust Score */}
        <Card className="border-0 shadow-md mt-8">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle>درجة الثقة في المجتمع</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${trustPercentage}%` }}
                  />
                </div>
              </div>
              <div className="text-4xl font-bold text-green-600">{trustPercentage}%</div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              {trustPercentage >= 80
                ? "مستوى ثقة عالي جداً في المجتمع"
                : trustPercentage >= 60
                ? "مستوى ثقة جيد في المجتمع"
                : trustPercentage >= 40
                ? "مستوى ثقة متوسط في المجتمع"
                : "مستوى ثقة منخفض - يرجى توخي الحذر"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
