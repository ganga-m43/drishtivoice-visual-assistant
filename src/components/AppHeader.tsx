import { Link, useRouterState } from "@tanstack/react-router";
import { Globe, Menu, X, CircleHelp } from "lucide-react";
import { useState } from "react";
import { DrishtiLogo } from "@/components/DrishtiLogo";
import { Button } from "@/components/ui/button";
import { useDrishti } from "@/contexts/DrishtiContext";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/talk", label: "Hands-free" },
  { to: "/assistant", label: "Voice Assistant" },
  { to: "/camera", label: "Camera" },
  { to: "/languages", label: "Languages" },
  { to: "/accessibility", label: "Accessibility" },
  { to: "/history", label: "History" },
] as const;

export function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { currentLanguageMeta, setSetupOpen } = useDrishti();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" aria-label="DrishtiVoice Home" className="rounded-lg">
          <DrishtiLogo />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-lg px-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="icon" className="min-h-12 min-w-12" aria-label="First-use setup" title="First-use setup" onClick={() => setSetupOpen(true)}><CircleHelp aria-hidden="true" /></Button>
          <Link
            to="/languages"
            aria-label={`Current language: ${currentLanguageMeta.name}. Change language`}
            className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Globe className="h-4 w-4 text-secondary" aria-hidden="true" />
            <span>{currentLanguageMeta.name}</span>
          </Link>
          <Button asChild size="lg" className="min-h-12 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/assistant">Get Started</Link>
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="min-h-12 min-w-12 lg:hidden"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-border bg-card px-4 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1.5">
            <li><Button variant="outline" className="min-h-12 w-full" onClick={() => { setMobileOpen(false); setSetupOpen(true); }}>First-use setup</Button></li>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`flex min-h-12 w-full items-center rounded-lg px-4 text-base font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 border-t border-border pt-4">
            <Button
              asChild
              size="lg"
              className="min-h-12 w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link to="/assistant" onClick={() => setMobileOpen(false)}>
                Start Voice Assistant
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}