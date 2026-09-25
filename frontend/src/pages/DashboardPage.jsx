import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../layouts/AppLayout";
import StatsCard from "../components/StatsCard";
import TaskCard from "../components/TaskCard";
import {
  fetchTaskStats,
  fetchTasks,
  updateTaskStatus,
  deleteTask,
} from "../services/taskService";
import toast from "react-hot-toast";
import {
  CheckSquare,
  Clock,
  Loader,
  AlertTriangle,
  TrendingUp,
  Plus,
  BarChart2,
} from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const [statsData, allTasks] = await Promise.all([
        fetchTaskStats(),
        fetchTasks({ sort: "newest" }),
      ]);
      setStats(statsData);
      setRecentTasks(allTasks.slice(0, 5));

      // Upcoming: tasks with due date, not completed, sorted by due date
      const upcoming = allTasks
        .filter((t) => t.dueDate && t.status !== "COMPLETED")
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 4);
      setUpcomingTasks(upcoming);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateTaskStatus(id, status);
      await loadDashboard();
      toast.success(status === "COMPLETED" ? "Task completed!" : "Task reopened");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      await loadDashboard();
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader className="animate-spin text-accent-green" size={28} />
        </div>
      </AppLayout>
    );
  }

  const completionPct = stats?.completionRate ?? 0;

  return (
    <AppLayout>
      {/* Greeting */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 18
              ? "afternoon"
              : "evening"}
            , {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-0.5 text-sm text-text-muted">
            Here's a summary of your tasks
          </p>
        </div>
        <Link
          to="/tasks/new"
          className="flex items-center gap-2 rounded-lg bg-accent-green px-4 py-2 text-sm font-semibold text-black transition hover:bg-accent-green-light"
        >
          <Plus size={16} /> New Task
        </Link>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatsCard
          label="Total Tasks"
          value={stats?.total ?? 0}
          icon={CheckSquare}
          color="text-white"
        />
        <StatsCard
          label="Pending"
          value={stats?.pending ?? 0}
          icon={Clock}
          color="text-amber-400"
        />
        <StatsCard
          label="In Progress"
          value={stats?.inProgress ?? 0}
          icon={Loader}
          color="text-blue-400"
        />
        <StatsCard
          label="Completed"
          value={stats?.completed ?? 0}
          icon={CheckSquare}
          color="text-accent-green"
        />
        <StatsCard
          label="High Priority"
          value={stats?.priority?.high ?? 0}
          icon={AlertTriangle}
          color="text-red-400"
        />
      </div>

      {/* Completion progress */}
      <div className="mb-8 rounded-xl border border-bg-border bg-bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-accent-green" />
            <span className="text-sm font-medium text-text-primary">
              Overall Progress
            </span>
          </div>
          <span className="text-sm font-bold text-accent-green">
            {completionPct}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-bg-hover">
          <div
            className="h-2 rounded-full bg-accent-green transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-text-muted">
          {stats?.completed} of {stats?.total} tasks completed
        </p>
      </div>

      {/* Two-column: Recent + Upcoming */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent tasks */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">
              Recent Tasks
            </h2>
            <Link to="/tasks" className="text-xs text-accent-green hover:underline">
              View all
            </Link>
          </div>
          {recentTasks.length === 0 ? (
            <div className="rounded-xl border border-bg-border bg-bg-card p-8 text-center">
              <p className="text-sm text-text-muted">No tasks yet.</p>
              <Link
                to="/tasks/new"
                className="mt-3 inline-block text-sm font-medium text-accent-green hover:underline"
              >
                Create your first task →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming tasks */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">
              Upcoming (by Due Date)
            </h2>
            <Link
              to="/analytics"
              className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary"
            >
              <BarChart2 size={12} /> Analytics
            </Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <div className="rounded-xl border border-bg-border bg-bg-card p-8 text-center">
              <p className="text-sm text-text-muted">
                No upcoming tasks with due dates.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
