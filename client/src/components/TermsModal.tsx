import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">شروط الإضافة كموثوق</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">امتلاك 100 دليل تعامل</h3>
                <p className="text-muted-foreground">
                  يجب أن تملك سجل تعاملات موثق يصل إلى 100 دليل على الأقل
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">أن تكون إداري في مجموعة ذات سمعة عالية</h3>
                <p className="text-muted-foreground">
                  يجب أن تكون مسؤول (إداري) في مجموعة معروفة وموثوقة بسمعة عالية (15 منشور يومياً على الأقل)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">أو مضمون من إداري لديه +100 دليل</h3>
                <p className="text-muted-foreground">
                  أو أن يكون لديك توصية من إداري موثوق يملك أكثر من 100 دليل تعامل
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">ملاحظة:</span> يجب استيفاء أحد هذه الشروط على الأقل للتقديم كموثوق
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="default">
            فهمت
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
