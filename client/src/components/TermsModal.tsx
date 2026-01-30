import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">شروط إضافة الحسابات كـ «موثوقة»</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4 text-right">
          {/* Important Note */}
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
            <p className="text-sm text-amber-900 font-semibold">ملاحظة مهمة:</p>
            <p className="text-sm text-amber-800 mt-2">
              هذه الشروط مؤقتة خلال المرحلة الحالية لعدم تفعيل نظام الضمان المالي بعد، وسيتم تخفيفها فور تطبيق آلية ضمان وتعويض واضحة.
            </p>
          </div>

          {/* First: Basic Conditions */}
          <div>
            <h3 className="font-bold text-lg mb-3">أولًا: الشروط الأساسية (إلزامية)</h3>
            <div className="space-y-4 ml-4">
              <div>
                <p className="font-semibold text-base mb-2">1. السمعة والسجل:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>عدم وجود بلاغات نصب مؤكدة سابقة</li>
                  <li>الالتزام بالأدب العام واحترام الأعضاء</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-base mb-2">2. التحقق الإداري:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>يخضع كل طلب لمراجعة يدوية من الإدارة</li>
                  <li>للإدارة الحق في قبول أو رفض الطلب دون إبداء أسباب تفصيلية حفاظًا على الأمان</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Second: Acceptance Paths */}
          <div>
            <h3 className="font-bold text-lg mb-3">ثانيًا: مسارات القبول (يكفي تحقق مسار واحد)</h3>
            <div className="space-y-4 ml-4">
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="font-semibold text-base mb-2">المسار (A): إداري موثوق</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>أن يكون المتقدم إداريًا في مجموعة ذات سمعة عالية</li>
                  <li>لا يقل متوسط النشاط عن 15 منشورًا يوميًا</li>
                  <li>وجود سجل واضح لإدارة النزاعات وحماية الأعضاء</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="font-semibold text-base mb-2">المسار (B): ضمان إداري</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>أن يكون مضمونًا من إداري موثوق</li>
                  <li>يتحمل الضامن مسؤولية التوصية في حال ثبوت مخالفة</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                <p className="font-semibold text-base mb-2">المسار (C): أدلة قوية مباشرة (اختياري)</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>يمكن تقديم 100 دليل قوي ومتنوع بقيمة تعاملات واضحة</li>
                  <li>يفضّل وجود دليل واحد على الأقل بقيمة تعامل مرتفعة نسبيًا</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Third: What is not acceptable */}
          <div>
            <h3 className="font-bold text-lg mb-3">ثالثًا: ما لا يُعتبر دليلًا مقبولًا</h3>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
              <li>لقطات شاشة قابلة للتلاعب دون سياق</li>
              <li>شهادات غير معروفة المصدر</li>
              <li>أدلة قديمة جدًا أو مكررة</li>
            </ul>
          </div>

          {/* Fourth: Follow-up and Accountability */}
          <div>
            <h3 className="font-bold text-lg mb-3">رابعًا: سياسة المتابعة والمساءلة</h3>
            <p className="text-sm mb-2">في حال ثبوت نصب أو مخالفة بعد الإضافة:</p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
              <li>يتم سحب صفة الموثوق فورًا</li>
              <li>نشر تنبيه للأعضاء</li>
              <li>حظر الحساب نهائيًا</li>
              <li>لا تتحمل الإدارة مسؤولية مالية في المرحلة الحالية</li>
            </ul>
          </div>

          {/* Fifth: Future Development Plan */}
          <div>
            <h3 className="font-bold text-lg mb-3">خامسًا: خطة التطوير القادمة</h3>
            <p className="text-sm mb-2">العمل على تفعيل نظام ضمان مالي وتعويض. عند التفعيل سيتم:</p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
              <li>تخفيف شروط الجروبات</li>
              <li>تسريع إجراءات القبول</li>
              <li>مراجعة استخدام الأدلة الاختيارية</li>
            </ul>
          </div>

          {/* Sixth: Acknowledgment */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <p className="font-semibold text-base mb-2">سادسًا: إقرار</p>
            <p className="text-sm text-gray-800">
              بالتقديم على صفة «موثوق»، يقر المتقدم بصحة البيانات والأدلة المقدمة، ويوافق على جميع الشروط والسياسات المذكورة أعلاه.
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="default" className="bg-blue-600 hover:bg-blue-700">
            فهمت
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
