import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit-react/ui";
import { Menu, X, Gem } from "lucide-react";
import { cn } from "../../lib/utils";

import { useStore } from '@nanostores/react';
import { $roleStore, ROLES, Role } from '../../store/roleStore';

import { ZkLoginButton, ZkLoginUserBadge } from "../shared/ZkLoginComponents";
import { useZkLogin } from "../../hooks/useZkLogin";

function NavItem({
  to,
  label,
  end,
  onClick,
}: {
  to: string;
  label: string;
  end?: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "relative text-sm font-medium transition-colors duration-150",
          isActive
            ? "text-[var(--color-primary)]"
            : "text-[var(--color-foreground)] hover:text-[var(--color-primary)]",
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <span className="absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-[var(--color-primary)]" />
          )}
        </>
      )}
    </NavLink>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeRole = useStore($roleStore);
  const { session } = useZkLogin();

  const navLinks = [
    { to: "/", label: "Home", end: true },
    ...(activeRole === "Artisan" || activeRole === "Owner" ? [{ to: "/dashboard", label: "Dashboard" }] : []),
    ...(activeRole === "Artisan" ? [{ to: "/create", label: "Create" }] : []),
    { to: "/scan", label: "Scan QR" },
  ];

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* ── Logo ── */}
        <NavLink
          to="/"
          className="flex items-center gap-2 font-display font-bold text-[var(--color-foreground)] hover:opacity-80 transition-opacity"
          aria-label="The Atelier home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-gradient">
            <Gem className="h-4 w-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-base tracking-tight">
            The<span className="text-gradient-primary">Atelier</span>
          </span>
        </NavLink>

        {/* ── Desktop nav ── */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        {/* ── Desktop wallet button & Role Switcher ── */}
        <div className="hidden items-center gap-4 md:flex">
          <select
            value={activeRole}
            onChange={(e) => $roleStore.set(e.target.value as Role)}
            className="rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-lowest)] px-3 py-1.5 text-sm text-[var(--color-foreground)] outline-none focus:border-emerald-500"
            aria-label="Active Role"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role} View
              </option>
            ))}
          </select>
          <ConnectButton />
          {session ? <ZkLoginUserBadge /> : <ZkLoginButton />}
        </div>

        {/* ── Mobile: wallet + hamburger ── */}
        <div className="flex items-center gap-3 md:hidden">
          {session ? <ZkLoginUserBadge /> : <ConnectButton />}
          <button
            id="mobile-menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-low)]"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out md:hidden",
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0",
        )}
        aria-hidden={!menuOpen}
      >
        <nav
          className="flex flex-col gap-1 border-t border-[var(--color-border)] bg-[var(--color-surface-lowest)] px-4 py-3"
          aria-label="Mobile navigation"
        >
          {/* Mobile Role Switcher */}
          <div className="mb-2 px-3 py-2">
            <select
              value={activeRole}
              onChange={(e) => $roleStore.set(e.target.value as Role)}
              className="w-full rounded-lg border border-[var(--color-outline-variant)] bg-transparent px-3 py-2 text-sm text-[var(--color-foreground)] outline-none"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role} View
                </option>
              ))}
            </select>
          </div>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-[var(--color-primary)]"
                    : "text-[var(--color-foreground)] hover:bg-[var(--color-surface-low)]",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
