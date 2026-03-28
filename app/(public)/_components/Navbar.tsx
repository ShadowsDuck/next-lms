"use client";

import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/web/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import UserDropdown from "./UserDropdown";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-medium self-center"
        >
          <Image
            src="https://thesvg.org/icons/azure-log-streaming/default.svg"
            alt="Logo"
            width={32}
            height={32}
          />
          <span className="font-bold text-lg">MarshalLMS.</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="ml-4 hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {isPending ? null : session ? (
              <UserDropdown
                name={session.user.name}
                email={session.user.email}
                image={session.user.image || ""}
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "secondary" })}
                >
                  <span>Login</span>
                </Link>
                <Link href="/register" className={buttonVariants()}>
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
