export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Navigation
    nav: {
      home: 'الرئيسية',
      verified: 'الموثوقين',
      scammers: 'النصابين',
      report: 'الإبلاغ',
      statistics: 'الإحصائيات',
      faq: 'الأسئلة الشائعة',
      about: 'حول المنصة',
      adminDashboard: 'لوحة التحكم',
      terms: 'الشروط',
      language: 'اللغة',
    },

    // Home Page
    home: {
      title: 'تحقق من موثوقية الأشخاص',
      description: 'منصة آمنة وموثوقة للتحقق من حالة الأشخاص والحسابات. ابحث بالاسم أو رابط الحساب للحصول على معلومات فورية.',
      searchPlaceholder: 'ابحث بالاسم أو رابط الحساب...',
      trusted: 'مضمون',
      scammer: 'نصاب',
      unknown: 'غير معروف',
      proofs: 'دليل',
      notFound: 'لم يتم العثور على النتيجة',
      didYouMean: 'هل تقصد',
    },

    // Badges
    badges: {
      verified: 'موثوق',
      topSeller: 'بائع مميز',
      middleman: 'وسيط معتمد',
      suspicious: 'مشبوه',
    },

    // Status
    status: {
      trusted: 'موثوق',
      scammer: 'نصاب',
      suspicious: 'مشبوه',
      notFound: 'غير معروف',
    },

    // Messages
    messages: {
      underReview: 'هذا الحساب عليه بلاغات قيد المراجعة، تعامل بحذر',
      scammerWarning: 'تحذير: هذا الحساب مسجل كنصاب. تجنب التعامل معه',
      verifiedSuccess: 'هذا الشخص مضمون ✅',
      topSellerBadge: 'بائع مميز - سجل ممتاز',
      middlemanBadge: 'وسيط معتمد - موثوق للتوسط',
    },

    // Buttons
    buttons: {
      search: 'بحث',
      report: 'الإبلاغ عن محتال',
      apply: 'تقديم طلب انضمام',
      submit: 'إرسال',
      cancel: 'إلغاء',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      view: 'عرض',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
    },

    // Terms
    terms: {
      title: 'شروط إضافة الحسابات كـ «موثوقة»',
      note: 'ملاحظة مهمة: هذه الشروط مؤقتة خلال المرحلة الحالية لعدم تفعيل نظام الضمان المالي بعد، وسيتم تخفيفها فور تطبيق آلية ضمان وتعويض واضحة.',
    },

    // Footer
    footer: {
      rights: 'جميع الحقوق محفوظة',
      contact: 'اتصل بنا',
      privacy: 'سياسة الخصوصية',
      terms: 'الشروط والأحكام',
    },
  },

  en: {
    // Navigation
    nav: {
      home: 'Home',
      verified: 'Verified',
      scammers: 'Scammers',
      report: 'Report',
      statistics: 'Statistics',
      faq: 'FAQ',
      about: 'About',
      adminDashboard: 'Admin Dashboard',
      terms: 'Terms',
      language: 'Language',
    },

    // Home Page
    home: {
      title: 'Verify People\'s Credibility',
      description: 'A safe and reliable platform to verify people and accounts status. Search by name or account link to get instant information.',
      searchPlaceholder: 'Search by name or account link...',
      trusted: 'Trusted',
      scammer: 'Scammer',
      unknown: 'Unknown',
      proofs: 'Proof',
      notFound: 'No results found',
      didYouMean: 'Did you mean',
    },

    // Badges
    badges: {
      verified: 'Verified',
      topSeller: 'Top Seller',
      middleman: 'Middleman',
      suspicious: 'Suspicious',
    },

    // Status
    status: {
      trusted: 'Trusted',
      scammer: 'Scammer',
      suspicious: 'Suspicious',
      notFound: 'Unknown',
    },

    // Messages
    messages: {
      underReview: 'This account has reports under review, deal with caution',
      scammerWarning: 'Warning: This account is registered as a scammer. Avoid dealing with it',
      verifiedSuccess: 'This person is verified ✅',
      topSellerBadge: 'Top Seller - Excellent record',
      middlemanBadge: 'Verified Middleman - Trusted for mediation',
    },

    // Buttons
    buttons: {
      search: 'Search',
      report: 'Report Scammer',
      apply: 'Submit Application',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      logout: 'Logout',
      login: 'Login',
    },

    // Terms
    terms: {
      title: 'Terms for Adding Accounts as "Verified"',
      note: 'Important Note: These terms are temporary during the current phase due to the lack of financial guarantee system activation, and will be relaxed once a clear guarantee and compensation mechanism is implemented.',
    },

    // Footer
    footer: {
      rights: 'All rights reserved',
      contact: 'Contact Us',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
    },
  },
};

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}

export function t(lang: Language, key: string): string {
  return getTranslation(lang, key);
}
