import { CheckCircle2, Star, Users } from "lucide-react";

interface BadgeProps {
  rank?: "verified" | "top_seller" | "middleman";
  size?: "sm" | "md" | "lg";
}

export function Badge({ rank = "verified", size = "md" }: BadgeProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const colorClasses = {
    verified: "text-green-600",
    top_seller: "text-yellow-500",
    middleman: "text-blue-700",
  };

  const labels = {
    verified: "موثوق",
    top_seller: "بائع مميز",
    middleman: "وسيط معتمد",
  };

  const icons = {
    verified: <CheckCircle2 className={`${sizeClasses[size]} ${colorClasses[rank]}`} />,
    top_seller: <Star className={`${sizeClasses[size]} ${colorClasses[rank]}`} fill="currentColor" />,
    middleman: <Users className={`${sizeClasses[size]} ${colorClasses[rank]}`} />,
  };

  return (
    <div className="flex items-center gap-1">
      {icons[rank]}
      <span className="text-xs font-medium text-gray-600">{labels[rank]}</span>
    </div>
  );
}
