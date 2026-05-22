"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, Wrench } from "lucide-react";
import { tools, categories, type ToolCategory } from "@/lib/config/tools";
import { cn } from "@/lib/utils/cn";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const grouped = Object.entries(categories).map(([key, label]) => ({
    category: key as ToolCategory,
    label,
    items: tools.filter((t) => t.category === key),
  }));

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="rounded-full p-2.5 text-on-surface-variant transition-colors duration-md-short ease-md-standard hover:bg-surface-container-highest md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-on-surface/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-[100] w-72 rounded-r-lg bg-surface-container-low shadow-elevation-3 animate-slide-in-from-left focus:outline-none">
          <div className="flex h-14 items-center justify-between px-4">
            <Dialog.Title className="flex items-center gap-2.5 text-[16px] font-medium leading-[24px] text-on-surface">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Wrench className="h-4 w-4 text-primary-foreground" />
              </div>
              DevTools Hub
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-highest"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mx-3 border-t border-outline-variant" />

          <nav className="overflow-y-auto p-3">
            {grouped
              .filter((g) => g.items.length > 0)
              .map((group) => (
                <div key={group.category} className="mb-3">
                  <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                    {group.label}
                  </p>
                  {group.items.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = pathname === `/${tool.slug}`;
                    return (
                      <Link
                        key={tool.id}
                        href={`/${tool.slug}`}
                        className={cn(
                          "flex items-center gap-3 rounded-full px-3 py-2.5 text-[14px] leading-[20px] transition-colors duration-md-short ease-md-standard",
                          isActive
                            ? "bg-secondary-container font-medium text-on-secondary-container"
                            : "text-on-surface-variant hover:bg-surface-container-highest",
                        )}
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0" />
                        <span className="truncate">{tool.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
