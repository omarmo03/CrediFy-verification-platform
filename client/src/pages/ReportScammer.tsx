import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { toast } from "sonner";

export default function ReportScammer() {
  const [formData, setFormData] = useState({
    reporterEmail: "",
    reporterName: "",
    scammerName: "",
    scammerLink: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const createReportMutation = trpc.reports.create.useMutation({
    onSuccess: () => {
      toast.success("تم إرسال الإبلاغ بنجاح. شكراً لمساهمتك في حماية المجتمع!");
      setFormData({
        reporterEmail: "",
        reporterName: "",
        scammerName: "",
        scammerLink: "",
        description: "",
      });
      setUploadedFiles([]);
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ أثناء إرسال الإبلاغ");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createReportMutation.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">إبلاغ عن محتال</h1>
          <p className="text-gray-600">ساعدنا في حماية المجتمع بالإبلاغ عن الحسابات المريبة والمحتالين</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              تفاصيل الإبلاغ
            </CardTitle>
            <CardDescription>
              يرجى ملء جميع التفاصيل بدقة لمساعدتنا في التحقق من الإبلاغ
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Reporter Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">معلومات المبلغ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم
                    </label>
                    <Input
                      type="text"
                      name="reporterName"
                      value={formData.reporterName}
                      onChange={handleInputChange}
                      placeholder="أدخل اسمك"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني
                    </label>
                    <Input
                      type="email"
                      name="reporterEmail"
                      value={formData.reporterEmail}
                      onChange={handleInputChange}
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Scammer Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">معلومات الحساب المريب</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم الحساب
                    </label>
                    <Input
                      type="text"
                      name="scammerName"
                      value={formData.scammerName}
                      onChange={handleInputChange}
                      placeholder="اسم الحساب المريب"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رابط الحساب
                    </label>
                    <Input
                      type="url"
                      name="scammerLink"
                      value={formData.scammerLink}
                      onChange={handleInputChange}
                      placeholder="https://example.com/profile"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">تفاصيل الإبلاغ</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    وصف الحادثة
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="اشرح ما حدث بالتفصيل (الحد الأدنى 10 أحرف)"
                    rows={5}
                    required
                    minLength={10}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length} / 10 أحرف على الأقل
                  </p>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">الأدلة والصور</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    اسحب الصور والملفات هنا أو انقر للاختيار
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button type="button" variant="outline" className="cursor-pointer">
                      اختر الملفات
                    </Button>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">الملفات المرفوعة:</p>
                    <ul className="space-y-1">
                      {uploadedFiles.map((file, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || createReportMutation.isPending}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 h-auto"
                >
                  {isSubmitting || createReportMutation.isPending ? "جاري الإرسال..." : "إرسال الإبلاغ"}
                </Button>
              </div>

              {/* Disclaimer */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-900">
                  <strong>تنبيه:</strong> الإبلاغات الكاذبة قد تؤدي إلى إجراءات قانونية. يرجى التأكد من صحة المعلومات قبل الإرسال.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
