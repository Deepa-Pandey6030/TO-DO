import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import toast from "react-hot-toast";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }
    try {
      setLoading(true);
      const data = await loginUser({ email, password });
      login(data.token, data.user);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-bg-border bg-bg-card px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-green focus:ring-1 focus:ring-accent-green";

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4 transition-colors duration-200">
      <div className="w-full max-w-md relative">
        <div className="absolute right-0 top-0">
          <ThemeToggle />
        </div>
        <div className="mb-8 text-center pt-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <CheckCircle size={24} className="text-accent-green" />
            <span className="text-xl font-bold text-text-primary">TaskFlow</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="mt-1 text-sm text-text-muted">
            Sign in to your account to continue
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-bg-border bg-bg-card p-8 backdrop-blur"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="mt-5 text-center text-sm text-text-muted">
            Don't have an account?{" "}
            <Link to="/register" className="text-accent-green hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
