import { LoginButton } from "./login-button";

export default async function Login({ searchParams }: PageProps<"/admin/login">) {
  const { error } = await searchParams;
  return (
    <main className="flex min-h-dvh flex-col justify-between p-4 md:p-8">
      <p className="font-mono text-xs uppercase text-muted">Admin</p>
      <div>
        <h1 className="mb-10 text-[18vw] leading-[0.8] font-medium tracking-[-0.06em] md:text-[10vw]">
          Login<span className="text-accent">.</span>
        </h1>
        {error && (
          <p className="mb-6 font-mono text-xs uppercase text-accent">
            {error === "forbidden" ? "Compte GitHub non autorisé." : "Connexion échouée."}
          </p>
        )}
        <LoginButton />
      </div>
    </main>
  );
}
