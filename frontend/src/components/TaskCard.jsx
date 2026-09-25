import { Link } from "react-router-dom";
import { Pencil, Trash2, Calendar, ChevronRight } from "lucide-react";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  PRIORITY_DOT,
  formatDate,
  isPastDue,
} from "../lib/utils";

/**
 * TaskCard — displays a task summary in a card.
 * Provides quick delete and links to the detail/edit page.
 */
const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const isOverdue =
    task.status !== "COMPLETED" && isPastDue(task.dueDate);

  return (
    <div
      className={`group relative rounded-xl border bg-bg-card p-4 transition-all hover:border-accent-green/40 hover:shadow-lg hover:shadow-accent-green/5 ${
        task.status === "COMPLETED"
          ? "border-bg-border opacity-70"
          : "border-bg-border"
      }`}
    >
      {/* Top row: status badge + priority dot */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            STATUS_COLORS[task.status]
          }`}
        >
          {STATUS_LABELS[task.status]}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${PRIORITY_DOT[task.priority]}`} />
            <span className="text-xs text-text-muted">
              {PRIORITY_LABELS[task.priority]}
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3
        className={`font-semibold text-text-primary line-clamp-2 ${
          task.status === "COMPLETED" ? "line-through text-text-muted" : ""
        }`}
      >
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="mt-1.5 text-sm text-text-secondary line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Category */}
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-md bg-bg-hover px-2 py-0.5 text-xs text-text-muted">
          {task.category}
        </span>
      </div>

      {/* Due date */}
      <div className="mt-3 flex items-center gap-1.5">
        <Calendar size={12} className={isOverdue ? "text-red-400" : "text-text-muted"} />
        <span className={`text-xs ${isOverdue ? "text-red-400 font-medium" : "text-text-muted"}`}>
          {task.dueDate ? formatDate(task.dueDate) : "No due date"}
          {isOverdue && " · Overdue"}
        </span>
      </div>

      {/* Actions row */}
      <div className="mt-4 flex items-center justify-between border-t border-bg-border pt-3">
        {/* Quick status toggle */}
        {task.status !== "COMPLETED" && onStatusChange && (
          <button
            onClick={() => onStatusChange(task._id, "COMPLETED")}
            className="text-xs text-text-muted hover:text-accent-green transition-colors"
          >
            ✓ Mark done
          </button>
        )}
        {task.status === "COMPLETED" && onStatusChange && (
          <button
            onClick={() => onStatusChange(task._id, "TODO")}
            className="text-xs text-text-muted hover:text-amber-400 transition-colors"
          >
            ↩ Reopen
          </button>
        )}
        <div className="flex items-center gap-1 ml-auto">
          <Link
            to={`/tasks/${task._id}`}
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-bg-hover hover:text-text-primary"
            title="View / Edit"
          >
            <Pencil size={14} />
          </Link>
          <button
            onClick={() => onDelete(task._id)}
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
          <Link
            to={`/tasks/${task._id}`}
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-bg-hover hover:text-text-primary"
            title="Open"
          >
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
