import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CATEGORIES, PRIORITIES, STATUSES, STATUS_LABELS, PRIORITY_LABELS } from "../lib/utils";

/**
 * TaskForm — used for both creating and editing a task.
 * Controlled form that calls onSubmit(data) on save.
 */
const buildInitialForm = (data = {}) => ({
  title: data.title || "",
  description: data.description || "",
  status: data.status || "TODO",
  priority: data.priority || "MEDIUM",
  category: data.category || "Other",
  dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split("T")[0] : "",
});

const TaskForm = ({ initialData = {}, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(() => buildInitialForm(initialData));

  // If initialData changes (e.g. fetched async), resync
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setForm(buildInitialForm(initialData));
    }
  }, [initialData.title]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      dueDate: form.dueDate || null,
    });
  };

  const inputClass =
    "w-full rounded-lg border border-bg-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-green focus:ring-1 focus:ring-accent-green";

  const labelClass = "block text-sm font-medium text-text-secondary mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className={labelClass}>
          Title <span className="text-red-400">*</span>
        </label>
        <input
          name="title"
          type="text"
          className={inputClass}
          placeholder="What needs to be done?"
          value={form.title}
          onChange={handleChange}
          required
          maxLength={200}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder="Add more details..."
          value={form.description}
          onChange={handleChange}
          maxLength={2000}
        />
      </div>

      {/* Status + Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Status</label>
          <select
            name="status"
            className={inputClass}
            value={form.status}
            onChange={handleChange}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Priority</label>
          <select
            name="priority"
            className={inputClass}
            value={form.priority}
            onChange={handleChange}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category + Due date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <select
            name="category"
            className={inputClass}
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Due Date</label>
          <input
            name="dueDate"
            type="date"
            className={inputClass}
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-bg-border px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-hover"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent-green px-5 py-2 text-sm font-semibold text-black transition hover:bg-accent-green-light disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
