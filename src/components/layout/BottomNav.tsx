import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, PlusCircle, ScanQrCode } from "lucide-react";
import { cn } from "../../lib/utils";

const BOTTOM_NAV = [
  { to: "/", icon: Home, label: "Home", end: true },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/create", icon: PlusCircle, label: "Create" },
  { to: "/scan", icon: ScanQrCode, label: "Scan" },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center border-t border-[var(--color-border)] bg-[var(--color-surface-lowest)]/90 backdrop-blur-md md:hidden"
      aria-label="Bottom navigation"
    >
      {BOTTOM_NAV.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          id={`bottom-nav-${label.toLowerCase()}`}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors duration-150",
              isActive
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150",
                  isActive && "bg-emerald-50 scale-110",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.75} />
              </span>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
