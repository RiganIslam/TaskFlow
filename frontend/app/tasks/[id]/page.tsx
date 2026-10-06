"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle2,
  Clock3,
  Circle,
} from "lucide-react";

type Task = {
  _id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "completed" | "review";
  project?: {
    _id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const id = params.id as string;

  useEffect(() => {
    async function loadTask() {
      const token = localStorage.getItem("taskflow_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/tasks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load task."
          );
        }

        setTask(data.task || data);
      } catch (err) {
        console.error(err);
        setError("Failed to load task.");
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [id, router]);

  async function deleteTask() {
    const token = localStorage.getItem("taskflow_token");

    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete task."
        );
      }

      router.push("/tasks");
    } catch (err) {
      console.error(err);
      setError("Failed to delete task.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <p className="text-slate-400">Loading task...</p>
        </div>
      </main>
    );
  }

  if (error || !task) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            {error || "Task not found."}
          </div>

          <button
            onClick={() => router.push("/tasks")}
            className="mt-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
          >
            <ArrowLeft size={18} />
            Back to Tasks
          </button>
        </div>
      </main>
    );
  }

  const statusConfig = {
    todo: {
      label: "Todo",
      icon: Circle,
      style: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    },
    "in-progress": {
      label: "In Progress",
      icon: Clock3,
      style: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    },
    completed: {
      label: "Completed",
      icon: CheckCircle2,
      style: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    },
    review: {
      label: "Review",
      icon: Clock3,
      style: "bg-orange-500/10 text-orange-300 border-orange-500/20",
    },
  };

  const currentStatus = statusConfig[task.status];
  const StatusIcon = currentStatus.icon;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* TOP */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => router.push("/tasks")}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Tasks
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/tasks/${id}/edit`)}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              <Edit size={17} />
              Edit
            </button>

            <button
              onClick={deleteTask}
              className="flex items-center gap-2 rounded-lg border border-red-500/20 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
            >
              <Trash2 size={17} />
              Delete
            </button>
          </div>
        </div>

        {/* CARD */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">

          <div className="border-b border-white/10 p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${currentStatus.style}`}
              >
                <StatusIcon size={14} />
                {currentStatus.label}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs capitalize text-slate-300">
                {task.priority} priority
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-bold">
              {task.title}
            </h1>

            {task.project && (
              <p className="mt-4 text-sm text-slate-500">
                Project:{" "}
                <span className="text-cyan-400">
                  {task.project.name}
                </span>
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="p-8">
            <h2 className="text-lg font-semibold">
              Description
            </h2>

            <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-400">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* META */}
          <div className="grid border-t border-white/10 sm:grid-cols-2">
            <div className="border-b border-white/10 p-6 sm:border-b-0 sm:border-r">
              <p className="text-xs uppercase tracking-wider text-slate-600">
                Status
              </p>

              <p className="mt-2 font-medium capitalize text-slate-200">
                {task.status.replace("-", " ")}
              </p>
            </div>

            <div className="p-6">
              <p className="text-xs uppercase tracking-wider text-slate-600">
                Priority
              </p>

              <p className="mt-2 font-medium capitalize text-slate-200">
                {task.priority}
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}