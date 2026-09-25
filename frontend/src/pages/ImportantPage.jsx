import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import TaskCard from "../components/TaskCard";
import {
  fetchTasks,
  deleteTask,
  updateTaskStatus,
} from "../services/taskService";
import toast from "react-hot-toast";
import { Star, Plus, Loader } from "lucide-react";

/**
 * Important — shows only HIGH priority tasks that are not completed.
 */
const ImportantPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchTasks({ priority: "HIGH" });
      setTasks(data.filter((t) => t.status !== "COMPLETED"));
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task completed!");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <AppLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Star size={18} className="text-amber-400" />
            <h1 className="text-xl font-bold text-text-primary">Important</h1>
          </div>
          <p className="mt-0.5 text-sm text-text-muted">
            High priority tasks that need your attention
          </p>
        </div>
        <Link
          to="/tasks/new"
          className="flex items-center gap-2 rounded-lg bg-accent-green px-4 py-2 text-sm font-semibold text-black transition hover:bg-accent-green-light"
        >
          <Plus size={16} /> New Task
        </Link>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader className="animate-spin text-accent-green" size={24} />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-bg-border bg-bg-card p-16 text-center">
          <Star size={40} className="mb-4 text-text-muted" />
          <p className="font-medium text-text-primary">No high priority tasks</p>
          <p className="mt-1 text-sm text-text-muted">
            All clear — you're on top of your important tasks.
          </p>
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

export default ImportantPage;
