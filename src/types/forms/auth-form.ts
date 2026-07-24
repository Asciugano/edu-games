import { z } from "zod";

// TODO: riscrivere in ITA

export const registerSchema = z
  .object({
    email: z.email(),
    name: z
      .string()
      .min(3, "user name must be at least 3 characters")
      .max(30, "user name must be under 30 characters"),
    password: z
      .string()
      .min(6, "password must be at least 6 characters")
      .max(100, "password must be under 100 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Le password non sono uguali",
  });

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, ""),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, "user name must be at least 3 characters")
    .max(30, "user name must be under 30 characters")
    .optional(),
  image: z.object({ url: z.url().optional(), key: z.string().optional() }),
  email: z.email().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
