import Link from "next/link";
import { Button } from "@/components/ui";

const features = [
  {
    icon: "📄",
    tone: "bg-indigo-100 text-indigo-700",
    title: "Invoices that get paid",
    body: "Create branded invoices in seconds, share a link with your client, and track exactly when they're due.",
  },
  {
    icon: "💸",
    tone: "bg-emerald-100 text-emerald-700",
    title: "Built for local payments",
    body: "Log payments by bank transfer, JazzCash, EasyPaisa, or cash — with a reference number for your records.",
  },
  {
    icon: "🤝",
    tone: "bg-amber-100 text-amber-700",
    title: "Proposals, not just invoices",
    body: "Send a proposal first, get it accepted, then convert it into an invoice without retyping anything.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white text-zinc-900">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-sm font-bold text-white">
            C
          </span>
          Chalan
        </span>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
            Log in
          </Link>
          <Link href="/register">
            <Button>Get started free</Button>
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6">
        <section className="relative flex flex-col items-start gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-8 py-20 sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"
          />
          <span className="relative rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-medium text-indigo-700">
            Made for freelancers &amp; agencies
          </span>
          <h1 className="relative max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Invoices and proposals your clients actually{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              pay on time.
            </span>
          </h1>
          <p className="relative max-w-xl text-lg text-zinc-600">
            Chalan is simple invoicing built for how freelancers in Pakistan actually get paid —
            bank transfer, JazzCash, EasyPaisa, or cash — with clean tracking for every rupee.
          </p>
          <div className="relative flex gap-3">
            <Link href="/register">
              <Button className="px-6 py-3 text-base">Start for free</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="px-6 py-3 text-base">
                Log in
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-6 py-16 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-5">
              <span className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${f.tone}`}>
                {f.icon}
              </span>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-zinc-600">{f.body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500">
        Chalan — invoicing &amp; proposals for freelancers and agencies.
      </footer>
    </div>
  );
}
