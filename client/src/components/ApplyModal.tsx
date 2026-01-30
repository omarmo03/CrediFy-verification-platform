import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyModal({ isOpen, onClose }: ApplyModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileLink: "",
    message: "",
  });

  const createJoinRequest = trpc.joinRequests.create.useMutation({
    onSuccess: () => {
      toast.success("تم استقبال طلبك بنجاح! سيتم التواصل معك قريباً");
      setFormData({ name: "", email: "", profileLink: "", message: "" });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ في إرسال الطلب");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.profileLink) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }
    createJoinRequest.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">تقديم طلب انضمام</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل *</Label>
            <Input
              id="name"
              placeholder="أدخل اسمك الكامل"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileLink">رابط الحساب/الملف الشخصي *</Label>
            <Input
              id="profileLink"
              type="url"
              placeholder="https://example.com/profile"
              value={formData.profileLink}
              onChange={(e) => setFormData({ ...formData, profileLink: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">رسالة إضافية</Label>
            <Textarea
              id="message"
              placeholder="أخبرنا عن نفسك وعن سبب تقديمك للانضمام..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="min-h-32"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              سيتم مراجعة طلبك من قبل فريقنا والتحقق من استيفاء الشروط المطلوبة
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={createJoinRequest.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createJoinRequest.isPending ? "جاري الإرسال..." : "إرسال الطلب"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
