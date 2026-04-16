import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit-react/ui";
import { Menu, X, Leaf } from "lucide-react";
import { cn } from "../../lib/utils";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/create", label: "Create" },
  { to: "/scan", label: "Scan QR" },
];

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

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* ── Logo ── */}
        <NavLink
          to="/"
          className="flex items-center gap-2 font-display font-bold text-[var(--color-foreground)] hover:opacity-80 transition-opacity"
          aria-label="ChainPassport home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-gradient">
            <Leaf className="h-4 w-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-base tracking-tight">
            Chain<span className="text-gradient-primary">Passport</span>
          </span>
        </NavLink>

        {/* ── Desktop nav ── */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        {/* ── Desktop wallet button ── */}
        <div className="hidden items-center md:flex">
          <ConnectButton />
        </div>

        {/* ── Mobile: wallet + hamburger ── */}
        <div className="flex items-center gap-3 md:hidden">
          <ConnectButton />
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
          {NAV_LINKS.map((link) => (
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
