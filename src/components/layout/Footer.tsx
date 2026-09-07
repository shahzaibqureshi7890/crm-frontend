"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "#",
  },
  {
    label: "Services",
    href: "#",
  },
  {
    label: "Contact",
    href: "#",
  },
];

export default function Footer() {
  const pathname = usePathname();
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div>
            <Link
              href="/"
              className="rounded-sm text-lg font-bold tracking-tight text-[var(--foreground)] transition-colors duration-300 hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              Crm Website
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--color-muted)]">
              A clean and professional platform designed to manage your business
              operations efficiently.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Quick Links
            </h2>
            <nav className="mt-4 flex flex-col gap-2.5">
              {footerLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`w-fit rounded-sm text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
                    pathname === item.href
                      ? "font-medium text-[var(--color-primary)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Contact
            </h2>
            <div className="mt-4 space-y-2.5 text-sm text-[var(--color-muted)]">
              <p>Email: info@example.com</p>
              <p>Phone: +92 300 0000000</p>
              <p>Pakistan</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-[var(--color-border)] pt-5">
          <p className="text-center text-xs text-[var(--color-muted)]">
            © {new Date().getFullYear()} Crm Website. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
