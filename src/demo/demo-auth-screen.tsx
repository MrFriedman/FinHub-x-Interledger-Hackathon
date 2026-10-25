export function DemoAuthScreen({ mode }: { mode: "sign-in" | "sign-up" }) {
  const title =
    mode === "sign-in" ? "Organization sign in" : "Organization registration";

  return (
    <main className="flex flex-col items-center px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-white/10 p-8 text-center text-foreground">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed">
          This hackathon demo signs you in as the University of Cape Town
          financial aid office. Clerk is not configured, so no account is
          created.
        </p>
        <a
          href="/profile"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
        >
          Continue as UCT demo
        </a>
      </div>
    </main>
  );
}
