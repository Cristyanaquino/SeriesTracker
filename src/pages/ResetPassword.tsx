import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Tv, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isResetMode, setIsResetMode] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Verificar se o usuário foi redirecionado com token de reset
  useEffect(() => {
    const checkResetToken = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setIsResetMode(true);
      }
    };
    checkResetToken();
  }, []);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsResetting(true);
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Senha redefinida com sucesso!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch {
      toast.error("Erro ao redefinir senha. Tente novamente.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50 px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600">
            <Tv className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">
            Series<span className="text-violet-600">Tracker</span>
          </span>
        </div>

        {!isResetMode ? (
          /* No reset token */
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <Lock className="h-7 w-7 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Link inválido ou expirado
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              O link de redefinição de senha expirou ou é inválido. Por favor,
              solicite um novo link.
            </p>
            <Button
              onClick={() => navigate("/forgot-password")}
              className="mt-6 w-full"
            >
              Solicitar novo link
            </Button>
          </div>
        ) : isResetting ? (
          /* Success state */
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Senha redefinida!
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Sua senha foi alterada com sucesso. Redirecionando para o login...
            </p>
          </div>
        ) : (
          /* Form */
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Redefinir senha
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Digite sua nova senha abaixo.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Redefinindo...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Redefinir Senha
                  </span>
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
