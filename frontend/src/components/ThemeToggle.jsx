import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/**
 * ThemeToggle — animated sun/moon button.
 * Clicking it flips between dark and light mode.
 */
const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`
        relative flex h-8 w-8 items-center justify-center
        rounded-lg border border-bg-border
        bg-bg-card text-text-secondary
        transition-all duration-200
        hover:border-accent-green hover:text-accent-green
        focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-1
        focus:ring-offset-bg-secondary
        ${className}
      `}
    >
      {/* Sun icon — visible in dark mode (click to go light) */}
      <Sun
        size={15}
        className={`absolute transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        }`}
      />
      {/* Moon icon — visible in light mode (click to go dark) */}
      <Moon
        size={15}
        className={`absolute transition-all duration-300 ${
          isDark
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
