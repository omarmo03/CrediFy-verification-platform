# نشر CrediFy على Railway

## 📋 المتطلبات

1. **حساب GitHub** - المشروع موجود بالفعل
2. **حساب Railway** - [railway.app](https://railway.app)
3. **حساب Google Cloud** - للحصول على Google OAuth credentials

---

## 🔑 الخطوة 1: الحصول على Google OAuth Credentials

### 1. اذهب إلى Google Cloud Console
- اذهب إلى [console.cloud.google.com](https://console.cloud.google.com)
- أنشئ مشروع جديد

### 2. تفعيل Google+ API
- ابحث عن "Google+ API"
- اضغط "Enable"

### 3. إنشاء OAuth Credentials
- اذهب إلى "Credentials"
- اضغط "Create Credentials" → "OAuth 2.0 Client ID"
- اختر "Web application"
- أضف هذا الرابط في "Authorized redirect URIs":
  ```
  https://your-railway-domain.up.railway.app/api/oauth/callback
  ```
- انسخ `Client ID` و `Client Secret`

---

## 🚀 الخطوة 2: نشر على Railway

### 1. اذهب إلى Railway
- اذهب إلى [railway.app](https://railway.app)
- سجل دخول باستخدام GitHub

### 2. إنشاء مشروع جديد
- اضغط "New Project"
- اختر "Deploy from GitHub"
- اختر مشروع `rps-verification-platform`

### 3. إضافة قاعدة بيانات MySQL
- اضغط "Add Service"
- اختر "MySQL"
- سيتم إنشاء قاعدة بيانات تلقائياً

### 4. تكوين المتغيرات البيئية
اضغط على مشروعك وأضف هذه المتغيرات:

```
GOOGLE_CLIENT_ID=<من Google Cloud>
GOOGLE_CLIENT_SECRET=<من Google Cloud>
REDIRECT_URI=https://your-railway-domain.up.railway.app/api/oauth/callback
DATABASE_URL=<سيتم ملؤه تلقائياً من MySQL>
JWT_SECRET=<أي نص عشوائي طويل>
NODE_ENV=production
PORT=3000
```

### 5. نشر المشروع
- اضغط "Deploy"
- سينشر تلقائياً

---

## 🔗 ربط دومين خاص

### 1. شراء دومين
- اشتر دومين من أي مزود (GoDaddy, Namecheap, إلخ)
- مثال: `credify.com`

### 2. ربط الدومين مع Railway
- اذهب إلى "Settings" في مشروعك
- اضغط "Domains"
- أضف دومينك الجديد
- اتبع التعليمات لتحديث DNS

---

## ✅ التحقق من النشر

1. اذهب إلى رابط موقعك
2. جرب البحث عن شخص
3. اضغط "تسجيل الدخول" واختبر Google OAuth
4. تحقق من أن لوحة التحكم تعمل

---

## 🐛 استكشاف الأخطاء

### الخطأ: "Database connection failed"
- تأكد من أن `DATABASE_URL` موجود في المتغيرات
- تحقق من أن MySQL service قيد التشغيل

### الخطأ: "Google OAuth failed"
- تأكد من أن `GOOGLE_CLIENT_ID` و `GOOGLE_CLIENT_SECRET` صحيحة
- تأكد من أن `REDIRECT_URI` يطابق ما في Google Cloud

### الخطأ: "Port already in use"
- Railway يعين الـ port تلقائياً، لا تقلق

---

## 📚 المراجع

- [Railway Docs](https://docs.railway.app)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [MySQL on Railway](https://docs.railway.app/plugins/mysql)
