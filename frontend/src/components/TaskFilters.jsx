import { Search, Filter } from "lucide-react";
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  CATEGORIES,
  STATUSES,
  PRIORITIES,
} from "../lib/utils";

/**
 * TaskFilters — search box + status/priority/category/sort dropdowns.
 * All filter state lives in the parent page.
 */
const TaskFilters = ({ filters, onChange }) => {
  const selectClass =
    "rounded-lg border border-bg-border bg-bg-card px-3 py-2 text-sm text-text-secondary outline-none transition focus:border-accent-green";

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full rounded-lg border border-bg-border bg-bg-card py-2 pl-9 pr-3 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-green"
          value={filters.search || ""}
          onChange={(e) => handleChange("search", e.target.value)}
        />
      </div>

      {/* Status */}
      <select
        className={selectClass}
        value={filters.status || "ALL"}
        onChange={(e) => handleChange("status", e.target.value)}
      >
        <option value="ALL">All Status</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      {/* Priority */}
      <select
        className={selectClass}
        value={filters.priority || "ALL"}
        onChange={(e) => handleChange("priority", e.target.value)}
      >
        <option value="ALL">All Priority</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {PRIORITY_LABELS[p]}
          </option>
        ))}
      </select>

      {/* Category */}
      <select
        className={selectClass}
        value={filters.category || "ALL"}
        onChange={(e) => handleChange("category", e.target.value)}
      >
        <option value="ALL">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        className={selectClass}
        value={filters.sort || "newest"}
        onChange={(e) => handleChange("sort", e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="dueDate">Due Date</option>
      </select>
    </div>
  );
};

export default TaskFilters;
