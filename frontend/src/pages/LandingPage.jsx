import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import {
  CheckCircle,
  ArrowRight,
  LayoutDashboard,
  Flag,
  TrendingUp,
  Zap,
  CheckSquare,
  Clock,
} from "lucide-react";

// --- Mini dashboard preview component (no real data, illustrative) ---
const PreviewCard = ({ title, status, priority, category }) => {
  const statusColors = {
    "To Do": "text-amber-400 bg-amber-400/10",
    "In Progress": "text-blue-400 bg-blue-400/10",
    "Completed": "text-accent-green bg-accent-green/10",
  };
  const priorityDots = {
    High: "bg-red-400",
    Medium: "bg-amber-400",
    Low: "bg-accent-green",
  };
  return (
    <div className="rounded-lg border border-bg-border bg-bg-card p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[status]}`}
        >
          {status}
        </span>
        <div className="flex items-center gap-1">
          <span className={`h-2 w-2 rounded-full ${priorityDots[priority]}`} />
          <span className="text-xs text-text-muted">{priority}</span>
        </div>
      </div>
      <p className="text-sm font-medium text-text-primary">{title}</p>
      <p className="mt-1 text-xs text-text-muted">{category}</p>
    </div>
  );
};

const DashboardPreview = () => (
  <div className="mx-auto max-w-2xl rounded-2xl border border-bg-border bg-bg-card p-5 backdrop-blur-sm">
    {/* Header bar */}
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CheckCircle size={16} className="text-accent-green" />
        <span className="text-sm font-semibold text-text-primary">TaskFlow</span>
      </div>
      <div className="h-6 w-6 rounded-full bg-accent-green/20 flex items-center justify-center">
        <span className="text-xs font-bold text-accent-green">D</span>
      </div>
    </div>

    {/* Stats row */}
    <div className="mb-4 grid grid-cols-4 gap-2">
      {[
        { label: "Total", value: "24", color: "text-text-primary" },
        { label: "Pending", value: "8", color: "text-amber-400" },
        { label: "In Progress", value: "4", color: "text-blue-400" },
        { label: "Done", value: "12", color: "text-accent-green" },
      ].map((s) => (
        <div key={s.label} className="rounded-lg bg-bg-card p-2.5 text-center">
          <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-xs text-text-muted">{s.label}</p>
        </div>
      ))}
    </div>

    {/* Progress bar */}
    <div className="mb-4">
      <div className="mb-1 flex justify-between text-xs text-text-secondary">
        <span>Completion</span>
        <span>50%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-bg-border">
        <div className="h-1.5 w-1/2 rounded-full bg-accent-green" />
      </div>
    </div>

    {/* Task cards */}
    <div className="space-y-2">
      <PreviewCard title="Prepare resume and portfolio" status="Completed" priority="High" category="Placement" />
      <PreviewCard title="Complete React assessment" status="In Progress" priority="High" category="Study" />
      <PreviewCard title="Review system design notes" status="To Do" priority="Medium" category="Study" />
    </div>
  </div>
);

// --- Feature card ---
const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="rounded-xl border border-bg-border bg-bg-card p-5 backdrop-blur-sm">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-green/10">
      <Icon size={20} className="text-accent-green" />
    </div>
    <h3 className="mb-1 font-semibold text-text-primary">{title}</h3>
    <p className="text-sm text-text-secondary">{desc}</p>
  </div>
);

// --- Step ---
const Step = ({ num, title }) => (
  <div className="flex items-start gap-4">
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-accent-green/30 text-sm font-bold text-accent-green">
      {num}
    </div>
    <div className="pt-2 text-sm font-medium text-text-secondary">{title}</div>
  </div>
);

// ─── Landing Page ────────────────────────────────────────────────────────────
const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Already logged in — go to dashboard
  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-bg-border bg-bg-primary/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-accent-green" />
            <span className="text-lg font-bold tracking-tight">TaskFlow</span>
          </div>
          <div className="hidden items-center gap-6 text-sm text-text-muted md:flex">
            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
            <a href="#how" className="hover:text-text-primary transition-colors">How It Works</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-sm font-medium text-text-secondary transition hover:text-text-primary"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-accent-green-light px-4 py-2 text-sm font-semibold text-black transition hover:bg-accent-green"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <div className="mb-4 inline-block rounded-full border border-accent-green/20 bg-accent-green/5 px-3 py-1 text-xs font-medium text-accent-green">
          Task Management · Productivity · Progress
        </div>
        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Organize your work.{" "}
          <span className="text-accent-green">Get things done.</span>
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-base text-text-secondary sm:text-lg">
          A simple, secure workspace to manage your tasks, priorities and
          progress in one place.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2 rounded-lg bg-accent-green-light px-6 py-3 font-semibold text-black transition hover:bg-accent-green"
          >
            Get Started <ArrowRight size={16} />
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-bg-border px-6 py-3 font-semibold text-text-secondary transition hover:border-bg-border hover:text-text-primary"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* ── Dashboard Preview ───────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 pb-24">
        <DashboardPreview />
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section id="features" className="border-t border-bg-border py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold">
            Everything you need
          </h2>
          <p className="mb-12 text-center text-sm text-text-muted">
            Designed for clarity, not complexity.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={LayoutDashboard}
              title="Organize Tasks"
              desc="Create and manage tasks in one clear, focused place."
            />
            <FeatureCard
              icon={Flag}
              title="Prioritize"
              desc="Set priorities and deadlines so the right work gets done first."
            />
            <FeatureCard
              icon={CheckSquare}
              title="Track Progress"
              desc="Monitor task completion with live status updates."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Productivity Insights"
              desc="Understand your progress through useful statistics."
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────── */}
      <section id="how" className="border-t border-bg-border py-20">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold">How it works</h2>
          <p className="mb-12 text-center text-sm text-text-muted">
            Up and running in seconds.
          </p>
          <div className="space-y-6">
            <Step num="01" title="Create your account" />
            <Step num="02" title="Add and organize your tasks" />
            <Step num="03" title="Track your progress" />
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="border-t border-bg-border py-20 text-center">
        <h2 className="mb-4 text-2xl font-bold">Ready to get organized?</h2>
        <p className="mb-8 text-sm text-text-muted">
          Join TaskFlow and start getting things done today.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 rounded-lg bg-accent-green-light px-8 py-3 font-semibold text-black transition hover:bg-accent-green"
        >
          Get Started <ArrowRight size={16} />
        </Link>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-bg-border py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle size={16} className="text-accent-green" />
          <span className="font-semibold text-text-primary">TaskFlow</span>
        </div>
        <p className="text-xs text-text-muted">
          Organize your work. Get things done.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
