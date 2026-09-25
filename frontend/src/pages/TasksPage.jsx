import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import TaskCard from "../components/TaskCard";
import TaskFilters from "../components/TaskFilters";
import {
  fetchTasks,
  deleteTask,
  updateTaskStatus,
} from "../services/taskService";
import toast from "react-hot-toast";
import { Plus, Loader, ClipboardList } from "lucide-react";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
    priority: "ALL",
    category: "ALL",
    sort: "newest",
  });

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      // Pass filters to backend — backend handles the query
      const params = {};
      if (filters.status !== "ALL") params.status = filters.status;
      if (filters.priority !== "ALL") params.priority = filters.priority;
      if (filters.category !== "ALL") params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;

      const data = await fetchTasks(params);
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => loadTasks(), 300); // debounce search
    return () => clearTimeout(timer);
  }, [loadTasks]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await updateTaskStatus(id, status);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      toast.success(status === "COMPLETED" ? "Task completed!" : "Task updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <AppLayout>
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">My Tasks</h1>
          <p className="mt-0.5 text-sm text-text-muted">
            {loading ? "..." : `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          to="/tasks/new"
          className="flex items-center gap-2 rounded-lg bg-accent-green px-4 py-2 text-sm font-semibold text-black transition hover:bg-accent-green-light"
        >
          <Plus size={16} /> New Task
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-bg-border bg-bg-card p-4">
        <TaskFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Task list */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader className="animate-spin text-accent-green" size={24} />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-bg-border bg-bg-card p-16 text-center">
          <ClipboardList size={40} className="mb-4 text-text-muted" />
          <p className="font-medium text-text-primary">No tasks found</p>
          <p className="mt-1 text-sm text-text-muted">
            Try adjusting filters or create a new task.
          </p>
          <Link
            to="/tasks/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent-green px-4 py-2 text-sm font-semibold text-black hover:bg-accent-green-light"
          >
            <Plus size={14} /> Create Task
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default TasksPage;
