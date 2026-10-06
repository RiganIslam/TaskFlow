"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  MoreHorizontal,
  Circle,
  Clock3,
  Eye,
  CheckCircle2,
  Loader2,
} from "lucide-react";

type Task = {
  _id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "review" | "completed";
  project?: {
    _id: string;
    name: string;
  };
};

type StatusType =
  | "todo"
  | "in-progress"
  | "review"
  | "completed";

const columns = [
  {
    id: "todo" as StatusType,
    title: "Todo",
    icon: Circle,
    color: "text-slate-300",
  },
  {
    id: "in-progress" as StatusType,
    title: "In Progress",
    icon: Clock3,
    color: "text-blue-400",
  },
  {
    id: "review" as StatusType,
    title: "Review",
    icon: Eye,
    color: "text-orange-400",
  },
  {
    id: "completed" as StatusType,
    title: "Completed",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
];

export default function KanbanPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const token = localStorage.getItem("taskflow_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load tasks."
        );
      }

      setTasks(data.tasks || data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    taskId: string,
    newStatus: StatusType
  ) {
    const token = localStorage.getItem("taskflow_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const oldTasks = [...tasks];

    setUpdating(taskId);

    // Instant UI update
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );

    try {
      const currentTask = tasks.find(
        (task) => task._id === taskId
      );

      if (!currentTask) return;

      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: currentTask.title,
            description: currentTask.description || "",
            project:
              typeof currentTask.project === "object"
                ? currentTask.project._id
                : currentTask.project,
            priority: currentTask.priority,
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status."
        );
      }
    } catch (err) {
      console.error(err);

      // Restore old data if update fails
      setTasks(oldTasks);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update task status."
      );
    } finally {
      setUpdating(null);
    }
  }

  function getPriorityStyle(priority: string) {
    if (priority === "high") {
      return "bg-red-500/10 text-red-300 border-red-500/20";
    }

    if (priority === "medium") {
      return "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";
    }

    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <div className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto max-w-7xl px-6 py-6">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>
              <button
                onClick={() => router.push("/dashboard")}
                className="mb-4 flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
              >
                <ArrowLeft size={17} />
                Dashboard
              </button>

              <h1 className="text-3xl font-bold">
                Kanban Board
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage your tasks and track progress.
              </p>
            </div>

            <button
              onClick={() => router.push("/tasks/create")}
              className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              <Plus size={19} />
              Create Task
            </button>

          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-6 py-8">

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-400">
              <Loader2
                size={22}
                className="animate-spin"
              />
              Loading tasks...
            </div>
          </div>
        ) : (

          <div className="grid gap-5 xl:grid-cols-4 lg:grid-cols-2">

            {columns.map((column) => {
              const Icon = column.icon;

              const columnTasks = tasks.filter(
                (task) => task.status === column.id
              );

              return (
                <div
                  key={column.id}
                  className="min-h-[500px] rounded-2xl border border-white/10 bg-white/[0.025]"
                >

                  {/* COLUMN HEADER */}
                  <div className="flex items-center justify-between border-b border-white/10 p-5">

                    <div className="flex items-center gap-3">
                      <Icon
                        size={18}
                        className={column.color}
                      />

                      <h2 className="font-semibold">
                        {column.title}
                      </h2>

                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-400">
                        {columnTasks.length}
                      </span>
                    </div>

                    <MoreHorizontal
                      size={18}
                      className="text-slate-600"
                    />

                  </div>

                  {/* TASKS */}
                  <div className="space-y-4 p-4">

                    {columnTasks.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                        <p className="text-sm text-slate-600">
                          No tasks
                        </p>
                      </div>
                    ) : (
                      columnTasks.map((task) => (

                        <div
                          key={task._id}
                          className="group rounded-xl border border-white/10 bg-slate-900/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
                        >

                          {/* TASK TOP */}
                          <div className="flex items-start justify-between gap-3">

                            <button
                              onClick={() =>
                                router.push(
                                  `/tasks/${task._id}`
                                )
                              }
                              className="text-left font-semibold transition hover:text-cyan-400"
                            >
                              {task.title}
                            </button>

                            <button
                              onClick={() =>
                                router.push(
                                  `/tasks/${task._id}/edit`
                                )
                              }
                              className="text-slate-600 opacity-0 transition group-hover:opacity-100 hover:text-white"
                            >
                              <MoreHorizontal size={18} />
                            </button>

                          </div>

                          {/* DESCRIPTION */}
                          {task.description && (
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                              {task.description}
                            </p>
                          )}

                          {/* PROJECT */}
                          {task.project && (
                            <p className="mt-4 text-xs text-cyan-400/80">
                              {task.project.name}
                            </p>
                          )}

                          {/* PRIORITY */}
                          <div className="mt-4">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${getPriorityStyle(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          {/* STATUS BUTTONS */}
                          <div className="mt-5 border-t border-white/10 pt-4">

                            <p className="mb-2 text-[11px] uppercase tracking-wider text-slate-600">
                              Move to
                            </p>

                            <div className="flex flex-wrap gap-2">

                              {columns
                                .filter(
                                  (item) =>
                                    item.id !==
                                    task.status
                                )
                                .map((item) => (
                                  <button
                                    key={item.id}
                                    disabled={
                                      updating === task._id
                                    }
                                    onClick={() =>
                                      updateStatus(
                                        task._id,
                                        item.id
                                      )
                                    }
                                    className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-400 disabled:opacity-50"
                                  >
                                    {updating ===
                                      task._id
                                      ? "Updating..."
                                      : item.title}
                                  </button>
                                ))}

                            </div>

                          </div>

                        </div>

                      ))
                    )}

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}