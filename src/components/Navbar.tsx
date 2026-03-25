import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const pathname = usePathname();
  const location = { pathname };
  const isLanding = location.pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark =
    theme === "dark" ||
    (theme === "system" && mounted && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const navLinks = isLanding
    ? [
        { label: "Features", href: "#features" },
        { label: "Templates", href: "#templates" },
        { label: "Testimonials", href: "#testimonials" },
      ]
    : [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Templates", href: "/templates" },
        { label: "Profile", href: "/profile" },
      ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <FileText className="h-6 w-6 text-primary" />
          <span>CVHub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) =>
            l.href.startsWith("#") ? (
              <a key={l.label} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ) : (
              <Link key={l.label} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </Link>
            )
          )}
          <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {isLanding ? (
            <Link href="/auth">
              <Button size="sm">Get Started</Button>
            </Link>
          ) : (
            <Link href="/builder">
              <Button size="sm">New Resume</Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-3 animate-fade-in">
          {navLinks.map((l) =>
            l.href.startsWith("#") ? (
              <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground">
                {l.label}
              </a>
            ) : (
              <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground">
                {l.label}
              </Link>
            )
          )}
          <Link href={isLanding ? "/auth" : "/builder"} onClick={() => setMobileOpen(false)}>
            <Button size="sm" className="w-full">{isLanding ? "Get Started" : "New Resume"}</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
