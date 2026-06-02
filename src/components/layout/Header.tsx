import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tv, Menu, LogOut, User, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";

interface HeaderProps {
  userEmail?: string;
  userFullName?: string;
}

export function Header({ userEmail, userFullName }: HeaderProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Até logo! 👋");
      navigate("/login");
    } catch {
      toast.error("Erro ao sair. Tente novamente.");
    } finally {
      setLoggingOut(false);
      setOpen(false);
    }
  };

  const initials = userFullName
    ? userFullName
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : userEmail?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
            <Tv className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">
            Series<span className="text-violet-600">Tracker</span>
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Avatar initials (desktop) */}
          <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-sm font-semibold">
            {initials}
          </div>

          {/* Hamburger Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Tv className="h-5 w-5 text-violet-600" />
                  SeriesTracker
                </SheetTitle>
                <SheetDescription>
                  Gerencie sua conta
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {/* User info */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-sm font-bold">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      {userFullName && (
                        <p className="font-semibold text-slate-900 truncate">
                          {userFullName}
                        </p>
                      )}
                      {userEmail && (
                        <p className="text-xs text-slate-500 truncate">
                          {userEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <nav className="space-y-1">
                  <button
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="h-4 w-4 text-slate-500" />
                      Meu Perfil
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                </nav>

                <div className="border-t border-slate-100 pt-4">
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? "Saindo..." : "Sair da Conta"}
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
