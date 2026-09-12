"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/invoices", label: "Invoices" },
  { href: "/proposals", label: "Proposals" },
  { href: "/clients", label: "Clients" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "rounded-md border-l-2 border-indigo-600 bg-indigo-50 px-2 py-2 text-sm font-medium text-indigo-700"
                : "rounded-md border-l-2 border-transparent px-2 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
