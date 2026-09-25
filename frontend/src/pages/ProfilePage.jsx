import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { useAuth } from "../context/AuthContext";
import { fetchTaskStats } from "../services/taskService";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, CheckSquare, LogOut } from "lucide-react";
import { formatDate } from "../lib/utils";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchTaskStats()
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Signed out");
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-xl font-bold text-text-primary">Profile</h1>

        {/* Avatar + name */}
        <div className="mb-6 rounded-xl border border-bg-border bg-bg-card p-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent-green/20">
            <span className="text-3xl font-bold text-accent-green">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <h2 className="text-lg font-bold text-text-primary">{user?.name}</h2>
          <p className="text-sm text-text-muted">{user?.email}</p>
        </div>

        {/* Account info */}
        <div className="mb-6 rounded-xl border border-bg-border bg-bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-text-primary">
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User size={16} className="text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Name</p>
                <p className="text-sm text-text-primary">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Email</p>
                <p className="text-sm text-text-primary">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        {stats && (
          <div className="mb-6 rounded-xl border border-bg-border bg-bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
              Your Progress
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {stats.total}
                </p>
                <p className="text-xs text-text-muted">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-green">
                  {stats.completed}
                </p>
                <p className="text-xs text-text-muted">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-green">
                  {stats.completionRate}%
                </p>
                <p className="text-xs text-text-muted">Rate</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
