import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Digite um e-mail válido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome muito longo"),
    email: z
      .string()
      .min(1, "E-mail é obrigatório")
      .email("Digite um e-mail válido"),
    password: z
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .max(72, "Senha muito longa"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Digite um e-mail válido"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .max(72, "Senha muito longa"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const seriesSchema = z.object({
  name: z
    .string()
    .min(1, "Nome da série é obrigatório")
    .max(200, "Nome muito longo"),
  platform: z
    .string()
    .min(1, "Plataforma é obrigatória")
    .max(100, "Nome da plataforma muito longo"),
  status: z.enum(["watching", "paused", "finished"]),
  season: z
    .number()
    .int("Temporada deve ser inteiro")
    .min(1, "Temporada mínima é 1")
    .max(99, "Temporada máxima é 99"),
  episode: z
    .number()
    .int("Episódio deve ser inteiro")
    .min(0, "Episódio mínimo é 0")
    .max(9999, "Episódio máximo é 9999"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type SeriesFormData = z.infer<typeof seriesSchema>;
