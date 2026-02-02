import { CheckCircle, AlertTriangle, HelpCircle, Award } from "lucide-react";
import type { Profile } from "../../../drizzle/schema";

interface SearchResultCardProps {
  profile: Profile | null;
  isLoading?: boolean;
  error?: string;
  suggestions?: Profile[];
}

export function SearchResultCard({ profile, isLoading, error, suggestions = [] }: SearchResultCardProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-8 rounded-2xl bg-muted animate-pulse">
        <div className="h-8 bg-muted-foreground/20 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-muted-foreground/20 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-8 rounded-2xl status-card-not-found">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold text-lg">غير معروف</h3>
            <p className="text-sm opacity-90">لم يتم العثور على هذا الشخص في قوائمنا</p>
          </div>
        </div>
        
        {suggestions.length > 0 && (
          <div className="border-t border-border/50 pt-6">
            <p className="text-sm font-medium mb-4">هل تقصد احد هؤلاء؟</p>
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <p className="font-medium text-sm">{suggestion.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{suggestion.profileLink}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  if (profile.status === "trusted") {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-8 rounded-2xl status-card-trusted transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl font-bold">{profile.name}</h2>
              <CheckCircle className="w-8 h-8 flex-shrink-0" />
            </div>
            <p className="text-sm opacity-90 mb-4 break-all">{profile.profileLink}</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge-trusted">
                <Award className="w-4 h-4" />
                موثوق
              </span>
              <div className="text-lg font-bold">
                <span className="text-2xl">+{profile.proofCount}</span>
                <span className="text-sm opacity-75 ml-2">دليل</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profile.status === "scammer") {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-8 rounded-2xl status-card-scammer transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">تحذير</h2>
            <p className="text-lg font-semibold mb-3">هذا الشخص نصاب</p>
            <p className="text-sm opacity-90 break-all">{profile.profileLink}</p>
            <div className="mt-4">
              <span className="badge-scammer">خطر</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-8 rounded-2xl status-card-not-found transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer">
      <div className="flex items-center gap-3">
        <HelpCircle className="w-6 h-6" />
        <div>
          <h3 className="font-semibold text-lg">غير معروف</h3>
          <p className="text-sm opacity-90">لم يتم العثور على هذا الشخص في قوائمنا</p>
        </div>
      </div>
    </div>
  );
}
