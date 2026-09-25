import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import TaskForm from "../components/TaskForm";
import { createTask } from "../services/taskService";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const CreateTaskPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    if (!formData.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    setLoading(true);
    try {
      await createTask(formData);
      toast.success("Task created!");
      navigate("/tasks");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-sm text-text-muted transition hover:text-text-primary"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-xl font-bold text-text-primary">Create New Task</h1>
          <p className="mt-0.5 text-sm text-text-muted">
            Fill in the details below to add a new task.
          </p>
        </div>

        <div className="rounded-xl border border-bg-border bg-bg-card p-6">
          <TaskForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            loading={loading}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateTaskPage;
