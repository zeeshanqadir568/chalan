import { type ComponentProps } from "react";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Input(props: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={cx(
        "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
        props.className
      )}
    />
  );
}

export function Textarea(props: ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={cx(
        "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
        props.className
      )}
    />
  );
}

export function Select(props: ComponentProps<"select">) {
  return (
    <select
      {...props}
      className={cx(
        "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
        props.className
      )}
    />
  );
}

export function Label({ children, ...props }: ComponentProps<"label">) {
  return (
    <label
      {...props}
      className={cx("mb-1 block text-sm font-medium text-zinc-700", props.className)}
    >
      {children}
    </label>
  );
}

export function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-red-600">{messages[0]}</p>;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  const styles: Record<string, string> = {
    primary: "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-300",
    secondary: "bg-white text-zinc-900 border border-zinc-300 hover:bg-zinc-50",
    danger: "bg-red-600 text-white hover:bg-red-500 disabled:bg-red-300",
    ghost: "bg-transparent text-zinc-600 hover:bg-zinc-100",
  };
  return (
    <button
      {...props}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed",
        styles[variant],
        className
      )}
    />
  );
}

const accentBorders: Record<string, string> = {
  indigo: "border-t-4 border-t-indigo-500",
  emerald: "border-t-4 border-t-emerald-500",
  amber: "border-t-4 border-t-amber-500",
  red: "border-t-4 border-t-red-500",
};

export function Card({
  children,
  className,
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: "indigo" | "emerald" | "amber" | "red";
}) {
  return (
    <div
      className={cx(
        "rounded-lg border border-zinc-200 bg-white p-6 shadow-sm",
        accent && accentBorders[accent],
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "zinc",
}: {
  children: React.ReactNode;
  tone?: "zinc" | "green" | "amber" | "red" | "blue";
}) {
  const tones: Record<string, string> = {
    zinc: "bg-zinc-100 text-zinc-700",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={cx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}
