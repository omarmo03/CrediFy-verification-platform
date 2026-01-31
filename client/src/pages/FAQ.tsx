import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "ما هي منصة RPS؟",
    answer:
      "منصة RPS هي قاعدة بيانات موثوقة للتحقق من الحسابات والأشخاص. توفر معلومات عن الحسابات الموثوقة والمحتالين لمساعدة المستخدمين على اتخاذ قرارات آمنة.",
  },
  {
    id: "2",
    question: "كيف يمكنني البحث عن حساب؟",
    answer:
      "استخدم شريط البحث في الصفحة الرئيسية. يمكنك البحث باستخدام اسم الحساب أو رابط الحساب. ستظهر النتائج بألوان مختلفة حسب حالة الحساب (أخضر للموثوق، أحمر للمحتال، رمادي للغير معروف).",
  },
  {
    id: "3",
    question: "ما هي شروط الإضافة كموثوق؟",
    answer:
      "يجب تحقيق أحد المسارات التالية: (أ) أن تكون إداريًا في مجموعة ذات سمعة عالية بمتوسط 15 منشور يوميًا، (ب) أن تكون مضمونًا من إداري موثوق، أو (ج) تقديم 100 دليل قوي. اضغط على زر الشروط في الصفحة الرئيسية للمزيد من التفاصيل.",
  },
  {
    id: "4",
    question: "كيف يمكنني الإبلاغ عن محتال؟",
    answer:
      "اذهب إلى صفحة 'إبلاغ عن محتال' من القائمة السفلية. ملأ النموذج بتفاصيل الحساب المريب والوصف الدقيق للحادثة. يمكنك أيضًا رفع صور وأدلة توضيحية. سيتم مراجعة إبلاغك من قبل فريق الإدارة.",
  },
  {
    id: "5",
    question: "ما هي الرتب والشارات المختلفة؟",
    answer:
      "هناك ثلاث رتب: (1) موثوق (أخضر) - الرتبة الأساسية، (2) بائع مميز (ذهبي) - لمن لديهم عدد دلائل مرتفع جدًا، (3) وسيط معتمد (أزرق داكن) - رتبة خاصة للوسطاء المعتمدين.",
  },
  {
    id: "6",
    question: "هل البيانات محدثة؟",
    answer:
      "نعم، يتم تحديث البيانات بشكل مستمر. عندما يتم التحقق من إبلاغ ما، يتم تحديث حالة الحساب فوراً. كما يمكن للمسؤولين إضافة أو تعديل البيانات حسب الحاجة.",
  },
  {
    id: "7",
    question: "هل يمكنني الوثوق بهذه المعلومات؟",
    answer:
      "نعم، جميع البيانات يتم التحقق منها من قبل فريق إدارة متخصص. ومع ذلك، ننصحك بأخذ احتياطاتك الشخصية عند التعامل مع أي حساب. إذا لاحظت أي نشاط مريب، يرجى الإبلاغ عنه فوراً.",
  },
  {
    id: "8",
    question: "كيف يمكنني الاتصال بالدعم؟",
    answer:
      "يمكنك الإبلاغ عن أي مشكلة أو اقتراح من خلال صفحة الإبلاغ. فريقنا يراجع جميع الإبلاغات والاقتراحات بعناية ويرد عليها في أقرب وقت ممكن.",
  },
  {
    id: "9",
    question: "هل هناك رسوم للاستخدام؟",
    answer:
      "لا، منصة RPS مجانية تماماً. جميع الخدمات متاحة للجميع دون أي رسوم. نحن نؤمن بأهمية حماية المجتمع من الاحتيال.",
  },
  {
    id: "10",
    question: "كيف يتم حماية خصوصيتي؟",
    answer:
      "نحن نحترم خصوصيتك. البيانات الشخصية التي تقدمها في الإبلاغات تُستخدم فقط للتحقق والمتابعة. لا نشارك معلوماتك مع أطراف ثالثة.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">الأسئلة الشائعة</h1>
              <p className="text-sm text-muted-foreground mt-1">
                إجابات على الأسئلة الشائعة حول منصة RPS
              </p>
            </div>
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => toggleOpen(item.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{item.question}</h3>
                    {openId === item.id && (
                      <p className="text-muted-foreground mt-3 leading-relaxed">{item.answer}</p>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                      openId === item.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-3xl mx-auto mt-12">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-900 mb-2">لم تجد إجابتك؟</h3>
              <p className="text-blue-800 mb-4">
                إذا كان لديك سؤال لم يتم الإجابة عليه هنا، يرجى الإبلاغ عنه من خلال صفحة الإبلاغ.
              </p>
              <a href="/report">
                <Button className="bg-blue-600 hover:bg-blue-700">إرسال استفسار</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
