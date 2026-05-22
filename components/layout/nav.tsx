"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { CommandPalette } from "@/components/layout/command-palette";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SettingsDropdown } from "@/components/shared/settings-dropdown";

export function Nav() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm supports-[backdrop-filter]:bg-surface/80 shadow-elevation-1">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[16px] font-medium leading-[24px] text-on-surface transition-colors duration-md-short ease-md-standard"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Wrench className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>DevTools Hub</span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          {!isHomepage && <CommandPalette />}
          <SettingsDropdown />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
