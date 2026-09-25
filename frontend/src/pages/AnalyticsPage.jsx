import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import StatsCard from "../components/StatsCard";
import { fetchTaskStats } from "../services/taskService";
import toast from "react-hot-toast";
import {
  CheckSquare,
  Clock,
  Loader,
  AlertTriangle,
  TrendingUp,
  BarChart2,
} from "lucide-react";

// Simple horizontal bar
const Bar = ({ label, value, total, color }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="font-medium text-text-primary">
          {value}{" "}
          <span className="text-text-muted text-xs">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-hover">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaskStats()
      .then((data) => setStats(data))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader className="animate-spin text-accent-green" size={28} />
        </div>
      </AppLayout>
    );
  }

  const {
    total = 0,
    completed = 0,
    pending = 0,
    inProgress = 0,
    completionRate = 0,
    priority = {},
    category = {},
  } = stats || {};

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <BarChart2 size={18} className="text-accent-green" />
          <h1 className="text-xl font-bold text-text-primary">Analytics</h1>
        </div>
        <p className="mt-0.5 text-sm text-text-muted">
          Your task performance at a glance
        </p>
      </div>

      {/* Overview cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatsCard label="Total Tasks" value={total} icon={CheckSquare} color="text-white" />
        <StatsCard label="Completed" value={completed} icon={CheckSquare} color="text-accent-green" />
        <StatsCard label="Pending" value={pending} icon={Clock} color="text-amber-400" />
        <StatsCard label="In Progress" value={inProgress} icon={Loader} color="text-blue-400" />
        <StatsCard label="Completion" value={`${completionRate}%`} icon={TrendingUp} color="text-accent-green" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Completion rate */}
        <div className="rounded-xl border border-bg-border bg-bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">
            Completion Rate
          </h2>
          <div className="flex items-center justify-center py-6">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#1a2035"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray={`${completionRate} ${100 - completionRate}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent-green">
                  {completionRate}%
                </p>
                <p className="text-xs text-text-muted">Done</p>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-text-muted">
            {completed} of {total} tasks completed
          </p>
        </div>

        {/* Status distribution */}
        <div className="rounded-xl border border-bg-border bg-bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">
            Status Distribution
          </h2>
          <Bar label="Completed" value={completed} total={total} color="bg-emerald-500" />
          <Bar label="In Progress" value={inProgress} total={total} color="bg-blue-500" />
          <Bar label="To Do" value={pending} total={total} color="bg-amber-500" />
        </div>

        {/* Priority distribution */}
        <div className="rounded-xl border border-bg-border bg-bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">
            Priority Distribution
          </h2>
          <Bar label="High" value={priority.high || 0} total={total} color="bg-red-500" />
          <Bar label="Medium" value={priority.medium || 0} total={total} color="bg-amber-500" />
          <Bar label="Low" value={priority.low || 0} total={total} color="bg-emerald-500" />
        </div>
      </div>

      {/* Category distribution */}
      {Object.keys(category).length > 0 && (
        <div className="mt-6 rounded-xl border border-bg-border bg-bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">
            Category Distribution
          </h2>
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {Object.entries(category).map(([cat, count]) => (
              <Bar
                key={cat}
                label={cat}
                value={count}
                total={total}
                color="bg-accent-green"
              />
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default AnalyticsPage;
