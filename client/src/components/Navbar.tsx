import { useState } from "react";
import { Menu, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface NavbarProps {
  onTermsClick: () => void;
  onApplyClick: () => void;
}

export function Navbar({ onTermsClick, onApplyClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "الرئيسية", href: "/" },
    { label: "الموثوقون", href: "/verified" },
    { label: "المحتالون", href: "/scammers" },
    { label: "الإحصائيات", href: "/statistics" },
    { label: "حول المنصة", href: "/about" },
    { label: "الأسئلة الشائعة", href: "/faq" },
  ];

  const actionItems = [
    { label: "إبلاغ عن محتال", href: "/report", type: "link" as const },
    { label: "طلب الانضمام", onClick: onApplyClick, type: "button" as const },
  ];

  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">CF</span>
              </div>
              <h1 className="text-xl font-bold">CrediFy</h1>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onTermsClick}
              className="gap-2"
            >
              <Info className="w-4 h-4" />
              الشروط
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onApplyClick}
            >
              طلب الانضمام
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border/50 pt-4">
            <nav className="space-y-1 mb-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>

            {/* Mobile Actions */}
            <div className="border-t border-border/50 pt-4 space-y-2">
              {actionItems.map((item) => (
                <div key={item.label}>
                  {item.type === "link" ? (
                    <Link href={item.href || "/"}>
                      <a
                        className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </a>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        item.onClick?.();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onTermsClick();
                  setIsOpen(false);
                }}
                className="w-full gap-2"
              >
                <Info className="w-4 h-4" />
                الشروط
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
