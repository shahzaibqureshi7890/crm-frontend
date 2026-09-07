"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";

const navLinks = [
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

const focusStyle =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const { user, isLoading } = useCurrentUser();

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isAuthenticated = user !== null;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMenu}
          className={`rounded-sm text-xl font-bold tracking-tight text-[var(--foreground)] transition-colors duration-300 hover:text-[var(--color-primary)] ${focusStyle}`}
        >
          Crm Website
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`rounded-sm text-sm font-medium transition-colors duration-300 ${focusStyle} ${
                pathname === item.href
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-primary)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          {!isLoading &&
            (isAuthenticated ? (
              <Link
                href="/dashboard"
                className={`rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-[var(--color-primary-dark)] ${focusStyle}`}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className={`rounded-lg border border-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition-colors duration-300 hover:bg-[var(--color-primary-light)] ${focusStyle}`}
                >
                  Registration
                </Link>

                <Link
                  href="/login"
                  className={`rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-[var(--color-primary-dark)] ${focusStyle}`}
                >
                  Login
                </Link>
              </>
            ))}
        </div>

        <button
          type="button"
          aria-label="Toggle Navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className={`rounded-lg border border-[var(--color-border-strong)] p-2 text-[var(--color-muted)] transition-colors duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] ${focusStyle} lg:hidden`}
        >
          {isOpen ? (
            <X size={21} strokeWidth={2} />
          ) : (
            <Menu size={21} strokeWidth={2} />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden">
          <nav className="flex flex-col px-4 py-5 sm:px-6">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className={`rounded-sm border-b border-[var(--color-border)] py-3 text-sm font-medium transition-colors duration-300 ${focusStyle} ${
                  pathname === item.href
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {!isLoading && (
              <div className="mt-5 flex flex-col gap-2.5">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className={`rounded-lg bg-[var(--color-primary)] py-2.5 text-center text-sm font-medium text-white transition-colors duration-300 hover:bg-[var(--color-primary-dark)] ${focusStyle}`}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className={`rounded-lg border border-[var(--color-primary)] py-2.5 text-center text-sm font-medium text-[var(--color-primary)] transition-colors duration-300 hover:bg-[var(--color-primary-light)] ${focusStyle}`}
                    >
                      Registration
                    </Link>

                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className={`rounded-lg bg-[var(--color-primary)] py-2.5 text-center text-sm font-medium text-white transition-colors duration-300 hover:bg-[var(--color-primary-dark)] ${focusStyle}`}
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
