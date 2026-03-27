"use client";

import { useState } from "react";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "@/modules/auth/schemas/register.schema";
import { registerAction } from "@/modules/auth/actions/register-action";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      email: "",
      senha: "",
      perfil: "ALUNO",
    },
  });

  const onSubmit = async (data: registerSchema) => {
    setError(null);
    setSuccess(null);

    try {
      const result = await registerAction(data);

      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      // Errors like redirect() from Next.js are handled by the framework,
      // but we might catch other unexpected errors here if any.
      if (err.message !== "NEXT_REDIRECT") {
        setError("Ocorreu um erro ao processar seu cadastro.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <main className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-black border border-border">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Crie sua conta
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Junte-se a nós para começar sua jornada
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

        {success && (
          <div
            className="rounded-md bg-green-500/15 p-3 text-sm text-green-600 border border-green-500/20"
            role="alert"
          >
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md">
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-foreground"
              >
                Nome Completo
              </label>
              <input
                {...register("nome")}
                id="nome"
                type="text"
                autoComplete="name"
                className={`mt-1 block w-full rounded-md border ${
                  errors.nome ? "border-destructive" : "border-border"
                } bg-input-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                placeholder="Seu Nome Completo"
              />
              {errors.nome && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cpf"
                className="block text-sm font-medium text-foreground"
              >
                CPF
              </label>
              <input
                {...register("cpf")}
                id="cpf"
                type="text"
                className={`mt-1 block w-full rounded-md border ${
                  errors.cpf ? "border-destructive" : "border-border"
                } bg-input-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                placeholder="000.000.000-00"
              />
              {errors.cpf && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.cpf.message}
                </p>
              )}
            </div>

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
                autoComplete="new-password"
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

            <div>
              <label
                htmlFor="perfil"
                className="block text-sm font-medium text-foreground"
              >
                Perfil
              </label>
              <select
                {...register("perfil")}
                id="perfil"
                className={`mt-1 block w-full rounded-md border ${
                  errors.perfil ? "border-destructive" : "border-border"
                } bg-input-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
              >
                <option value="ALUNO">Aluno</option>
                <option value="PROFESSOR">Professor</option>
              </select>
              {errors.perfil && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.perfil.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isSubmitting ? "Criando conta..." : "Criar Conta"}
            </button>
          </div>
        </form>

        <footer className="text-center text-sm text-muted-foreground">
          Já possui uma conta?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Entrar agora
          </Link>
        </footer>
      </main>
    </div>
  );
}
