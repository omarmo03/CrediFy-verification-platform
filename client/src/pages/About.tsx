import { Shield, Users, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  const features = [
    {
      icon: Shield,
      title: "الحماية من الاحتيال",
      description: "قاعدة بيانات شاملة تساعدك على التحقق من الحسابات والأشخاص بسهولة",
    },
    {
      icon: Users,
      title: "مجتمع آمن",
      description: "نعمل مع مجتمع من الموثوقين والخبراء للتحقق من المعلومات",
    },
    {
      icon: TrendingUp,
      title: "بيانات محدثة",
      description: "يتم تحديث البيانات بشكل مستمر لضمان دقة المعلومات",
    },
    {
      icon: Zap,
      title: "سهل الاستخدام",
      description: "واجهة بسيطة وسريعة للبحث والتحقق من الحسابات",
    },
  ];

  const stats = [
    { number: "1000+", label: "حساب موثوق" },
    { number: "500+", label: "حساب محتال" },
    { number: "10000+", label: "مستخدم نشط" },
    { number: "24/7", label: "دعم مستمر" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <h1 className="text-3xl font-bold text-foreground">حول منصة RPS</h1>
          <p className="text-sm text-muted-foreground mt-1">
            تعرف على رسالتنا وقيمنا
          </p>
        </div>
      </header>

      <main className="container py-12">
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto mb-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              منصة موثوقة للتحقق من الحسابات
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              منصة RPS هي قاعدة بيانات شاملة وموثوقة تساعد المستخدمين على التحقق من الحسابات والأشخاص.
              نحن نعمل على حماية المجتمع من الاحتيال والنصب من خلال توفير معلومات دقيقة ومحدثة.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="max-w-3xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">رسالتنا</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                نحن نؤمن بأن الثقة والأمان هما أساس أي معاملة ناجحة. رسالتنا هي بناء مجتمع آمن
                من خلال توفير معلومات موثوقة عن الحسابات والأشخاص، مما يساعد المستخدمين على اتخاذ
                قرارات آمنة وحكيمة.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                نعمل بشفافية وأمانة، ونتحقق من جميع المعلومات قبل إضافتها إلى قاعدة البيانات.
                كل حساب موثوق يتم التحقق منه بعناية، وكل إبلاغ عن محتال يتم فحصه بدقة.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">مميزاتنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Icon className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">إحصائياتنا</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">قيمنا</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">الشفافية</h4>
                  <p className="text-muted-foreground">
                    نعمل بشفافية كاملة ونوضح معايير التحقق من الحسابات.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">الدقة</h4>
                  <p className="text-muted-foreground">
                    نتحقق من جميع المعلومات بعناية قبل إضافتها إلى قاعدة البيانات.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">الأمان</h4>
                  <p className="text-muted-foreground">
                    نحمي خصوصية المستخدمين ولا نشارك معلوماتهم مع أطراف ثالثة.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">الاستجابة</h4>
                  <p className="text-muted-foreground">
                    نرد على جميع الإبلاغات والاستفسارات في أقرب وقت ممكن.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
