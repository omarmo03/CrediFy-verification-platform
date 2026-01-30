import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Trash2, Edit2, Plus, LogOut, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  profileLink: string;
  status: "trusted" | "scammer" | "not_found";
  proofCount: number;
}

export default function Admin() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    profileLink: "",
    status: "not_found",
    proofCount: 0,
  });

  const getAllProfiles = trpc.profiles.getAll.useQuery();
  const createProfile = trpc.profiles.create.useMutation({
    onSuccess: () => {
      toast.success("تم إضافة الشخص بنجاح");
      setShowDialog(false);
      resetForm();
      getAllProfiles.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ في إضافة الشخص");
    },
  });

  const updateProfile = trpc.profiles.update.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث الشخص بنجاح");
      setShowDialog(false);
      resetForm();
      getAllProfiles.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ في تحديث الشخص");
    },
  });

  const deleteProfile = trpc.profiles.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف الشخص بنجاح");
      getAllProfiles.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ في حذف الشخص");
    },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/");
      return;
    }
    if (user && user.role !== "admin") {
      setLocation("/");
      toast.error("ليس لديك صلاحيات الوصول إلى لوحة التحكم");
    }
  }, [loading, isAuthenticated, user, setLocation]);

  useEffect(() => {
    if (getAllProfiles.data) {
      setProfiles(getAllProfiles.data);
    }
  }, [getAllProfiles.data]);

  const resetForm = () => {
    setFormData({
      name: "",
      profileLink: "",
      status: "not_found",
      proofCount: 0,
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.profileLink) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    if (editingId) {
      updateProfile.mutate({
        id: editingId,
        ...formData,
      });
    } else {
      createProfile.mutate(formData);
    }
  };

  const handleEdit = (profile: any) => {
    setFormData({
      name: profile.name,
      profileLink: profile.profileLink,
      status: profile.status,
      proofCount: profile.proofCount,
    });
    setEditingId(profile.id);
    setShowDialog(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الشخص؟")) {
      deleteProfile.mutate({ id });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">لوحة التحكم الإدارية</h1>
            <p className="text-sm text-muted-foreground">مرحباً {user.name}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              setLocation("/");
            }}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-6">
          <Button
            onClick={() => {
              resetForm();
              setShowDialog(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة شخص جديد
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>رابط الحساب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>عدد الدلائل</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    لا توجد بيانات
                  </TableCell>
                </TableRow>
              ) : (
                profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.name}</TableCell>
                    <TableCell className="text-sm break-all">{profile.profileLink}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          profile.status === "trusted"
                            ? "bg-green-100 text-green-700"
                            : profile.status === "scammer"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {profile.status === "trusted"
                          ? "موثوق"
                          : profile.status === "scammer"
                          ? "نصاب"
                          : "غير معروف"}
                      </span>
                    </TableCell>
                    <TableCell>{profile.proofCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(profile)}
                          className="gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(profile.id)}
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "تعديل الشخص" : "إضافة شخص جديد"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم *</Label>
              <Input
                id="name"
                placeholder="أدخل الاسم"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileLink">رابط الحساب *</Label>
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
              <Label htmlFor="status">الحالة *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trusted">موثوق</SelectItem>
                  <SelectItem value="scammer">نصاب</SelectItem>
                  <SelectItem value="not_found">غير معروف</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proofCount">عدد الدلائل</Label>
              <Input
                id="proofCount"
                type="number"
                min="0"
                value={formData.proofCount}
                onChange={(e) => setFormData({ ...formData, proofCount: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDialog(false);
                  resetForm();
                }}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={createProfile.isPending || updateProfile.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createProfile.isPending || updateProfile.isPending
                  ? "جاري..."
                  : editingId
                  ? "تحديث"
                  : "إضافة"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
