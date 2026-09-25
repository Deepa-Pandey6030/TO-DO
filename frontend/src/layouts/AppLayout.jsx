import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import {
  LayoutDashboard,
  CheckSquare,
  Star,
  BarChart2,
  User,
  LogOut,
  Menu,
  CheckCircle,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/tasks", icon: CheckSquare, label: "My Tasks" },
  { to: "/important", icon: Star, label: "Important" },
  { to: "/analytics", icon: BarChart2, label: "Analytics" },
  { to: "/profile", icon: User, label: "Profile" },
];

const NavItem = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-accent-green/10 text-accent-green"
          : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
      }`
    }
  >
    <Icon size={18} />
    {label}
  </NavLink>
);

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeMobile = () => setMobileOpen(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo + theme toggle */}
      <div className="flex items-center justify-between border-b border-bg-border px-4 py-5">
        <div className="flex items-center gap-2">
          <CheckCircle size={22} className="text-accent-green" />
          <span className="text-lg font-bold text-text-primary tracking-tight">
            TaskFlow
          </span>
        </div>
        <ThemeToggle />
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={closeMobile} />
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-bg-border p-3">
        <div className="mb-2 rounded-lg px-3 py-2">
          <p className="text-sm font-medium text-text-primary truncate">
            {user?.name}
          </p>
          <p className="text-xs text-text-muted truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-bg-primary">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 flex-shrink-0 border-r border-bg-border bg-bg-secondary lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 transform bg-bg-secondary transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar — mobile */}
        <header className="flex items-center justify-between border-b border-bg-border bg-bg-secondary px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 text-text-secondary hover:bg-bg-hover"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-accent-green" />
            <span className="font-bold text-text-primary">TaskFlow</span>
          </div>
          {/* Theme toggle visible on mobile top bar */}
          <ThemeToggle />
        </header>

        {/* Top bar — desktop */}
        <header className="hidden items-center justify-between border-b border-bg-border bg-bg-secondary px-6 py-3 lg:flex">
          <div />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-accent-green/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-accent-green">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-text-primary">
              {user?.name}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
