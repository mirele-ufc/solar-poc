import Link from "next/link";

export default function RegisterPage() {
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

        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-foreground">
                Nome Completo
              </label>
              <input
                id="full-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full rounded-md border border-border bg-input-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="Seu Nome Completo"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-foreground">
                Endereço de E-mail
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-md border border-border bg-input-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="exemplo@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full rounded-md border border-border bg-input-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground">
                Confirmar Senha
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full rounded-md border border-border bg-input-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Criar Conta
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
