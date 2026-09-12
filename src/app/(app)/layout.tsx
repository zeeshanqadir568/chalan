import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { SidebarNav } from "@/components/sidebar-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-full flex-1 bg-zinc-50">
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white px-4 py-6">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2 text-lg font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-sm font-bold text-white">
            C
          </span>
          <span className="text-zinc-900">Chalan</span>
        </Link>
        <SidebarNav />
        <div className="mt-auto flex flex-col gap-2 border-t border-zinc-200 pt-4">
          <p className="truncate px-2 text-xs text-zinc-500">{session.user.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="w-full rounded-md px-2 py-2 text-left text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
              Log out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
