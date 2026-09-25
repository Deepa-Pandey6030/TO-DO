import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import TaskForm from "../components/TaskForm";
import { fetchTaskById, updateTask, deleteTask } from "../services/taskService";
import toast from "react-hot-toast";
import { ArrowLeft, Trash2, Loader } from "lucide-react";
import {
  formatDate,
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
} from "../lib/utils";

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchTaskById(id)
      .then((t) => setTask(t))
      .catch(() => {
        toast.error("Task not found");
        navigate("/tasks");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      const updated = await updateTask(id, formData);
      setTask(updated);
      setEditing(false);
      toast.success("Task updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task permanently?")) return;
    try {
      await deleteTask(id);
      toast.success("Task deleted");
      navigate("/tasks");
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

  if (!task) return null;

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl">
        {/* Back + delete */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-text-muted transition hover:text-text-primary"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>

        {/* Task detail card */}
        <div className="rounded-xl border border-bg-border bg-bg-card p-6">
          {editing ? (
            <>
              <h2 className="mb-5 text-lg font-bold text-text-primary">
                Edit Task
              </h2>
              <TaskForm
                initialData={task}
                onSubmit={handleUpdate}
                onCancel={() => setEditing(false)}
                loading={saving}
              />
            </>
          ) : (
            <>
              {/* View mode */}
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-text-primary">
                    {task.title}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[task.status]}`}
                    >
                      {STATUS_LABELS[task.status]}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}
                    >
                      {PRIORITY_LABELS[task.priority]} Priority
                    </span>
                    <span className="rounded-md bg-bg-hover px-2 py-0.5 text-xs text-text-muted">
                      {task.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-lg border border-bg-border px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-hover hover:text-text-primary"
                >
                  Edit
                </button>
              </div>

              {/* Description */}
              {task.description ? (
                <div className="mb-5">
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-text-muted">
                    Description
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              ) : (
                <p className="mb-5 text-sm italic text-text-muted">
                  No description added.
                </p>
              )}

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-bg-hover p-4">
                <div>
                  <p className="mb-0.5 text-xs font-medium text-text-muted">
                    Due Date
                  </p>
                  <p className="text-sm text-text-primary">
                    {task.dueDate ? formatDate(task.dueDate) : "—"}
                  </p>
                </div>
                <div>
                  <p className="mb-0.5 text-xs font-medium text-text-muted">
                    Category
                  </p>
                  <p className="text-sm text-text-primary">{task.category}</p>
                </div>
                <div>
                  <p className="mb-0.5 text-xs font-medium text-text-muted">
                    Created
                  </p>
                  <p className="text-sm text-text-primary">
                    {formatDate(task.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="mb-0.5 text-xs font-medium text-text-muted">
                    Last Updated
                  </p>
                  <p className="text-sm text-text-primary">
                    {formatDate(task.updatedAt)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default TaskDetailPage;
