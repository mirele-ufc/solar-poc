"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "@/modules/auth/schemas/login.schema";
import { loginAction } from "@/modules/auth/actions/login-action";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const onSubmit = async (data: loginSchema) => {
    setError(null);

    try {
      const result = await loginAction(data);

      console.log(result);

      if (result.success) {
        // Redirection handled on the client side upon successful login
        router.push("/");
        router.refresh();
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      console.error("Login Submission Error:", err);
      setError("Ocorreu um erro ao tentar realizar o login.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <main className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-black border border-border">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Acessar sua conta
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com suas credenciais para continuar
          </p>
        </header>

        {error && (
          <div
            className="rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20"
            role="alert"
          >
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Endereço de E-mail
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                className={`mt-1 block w-full rounded-md border ${
                  errors.email ? "border-destructive" : "border-border"
                } bg-input-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                placeholder="exemplo@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-foreground"
              >
                Senha
              </label>
              <input
                {...register("senha")}
                id="senha"
                type="password"
                autoComplete="current-password"
                className={`mt-1 block w-full rounded-md border ${
                  errors.senha ? "border-destructive" : "border-border"
                } bg-input-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                placeholder="••••••••"
              />
              {errors.senha && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.senha.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-primary hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>

        <footer className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Cadastre-se agora
          </Link>
        </footer>
      </main>
    </div>
  );
}
