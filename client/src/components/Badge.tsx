import { CheckCircle2, AlertCircle } from 'lucide-react';

interface BadgeProps {
  rank?: string;
  status?: string;
  proofCount?: number;
  language?: 'ar' | 'en';
}

export function Badge({ rank = 'verified', status = 'trusted', proofCount = 0, language = 'ar' }: BadgeProps) {
  // Strict badge logic - based on rank only
  if (rank === 'middleman') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900 text-white text-sm font-semibold">
        <CheckCircle2 className="w-4 h-4 text-blue-400" />
        <span>{language === 'ar' ? 'وسيط معتمد' : 'Verified Middleman'}</span>
      </div>
    );
  }

  if (rank === 'top_seller') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500 text-white text-sm font-semibold">
        <CheckCircle2 className="w-4 h-4 text-yellow-300" />
        <span>{language === 'ar' ? 'بائع مميز' : 'Top Seller'}</span>
      </div>
    );
  }

  if (rank === 'verified') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
        <span>✓ {language === 'ar' ? 'مضمون' : 'Verified'}</span>
      </div>
    );
  }

  // Default for unknown rank
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold">
      <span>{language === 'ar' ? 'غير معروف' : 'Unknown'}</span>
    </div>
  );
}

export function SuspiciousBadge({ language = 'ar' }: { language?: 'ar' | 'en' }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
      <AlertCircle className="w-4 h-4 text-yellow-600" />
      <span>{language === 'ar' ? 'مشبوه - قيد المراجعة' : 'Suspicious - Under Review'}</span>
    </div>
  );
}

export function ScammerBadge({ language = 'ar' }: { language?: 'ar' | 'en' }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-semibold">
      <AlertCircle className="w-4 h-4 text-red-600" />
      <span>{language === 'ar' ? '⚠️ نصاب مؤكد' : '⚠️ Confirmed Scammer'}</span>
    </div>
  );
}
