/**
 * Shared utility functions for UI formatting
 */

export function formatDate(date) {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function isPastDue(date) {
  if (!date) return false;
  return new Date(date) < new Date() && true;
}

export const STATUS_LABELS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export const STATUS_COLORS = {
  TODO: "text-amber-400 bg-amber-400/10",
  IN_PROGRESS: "text-blue-400 bg-blue-400/10",
  COMPLETED: "text-emerald-400 bg-emerald-400/10",
};

export const PRIORITY_LABELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const PRIORITY_COLORS = {
  LOW: "text-emerald-400 bg-emerald-400/10",
  MEDIUM: "text-amber-400 bg-amber-400/10",
  HIGH: "text-red-400 bg-red-400/10",
};

export const PRIORITY_DOT = {
  LOW: "bg-emerald-400",
  MEDIUM: "bg-amber-400",
  HIGH: "bg-red-400",
};

export const CATEGORIES = ["Personal", "Work", "Study", "Placement", "Other"];
export const STATUSES = ["TODO", "IN_PROGRESS", "COMPLETED"];
export const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];