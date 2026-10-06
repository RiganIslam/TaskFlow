"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

type Project = {
  _id: string;
  name: string;
};

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [projects, setProjects] = useState<Project[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("taskflow_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const [taskResponse, projectResponse] =
          await Promise.all([
            fetch(`http://localhost:5000/api/tasks/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch("http://localhost:5000/api/projects", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        const taskData = await taskResponse.json();
        const projectData = await projectResponse.json();

        if (!taskResponse.ok) {
          throw new Error(
            taskData.message || "Failed to load task."
          );
        }

        if (!projectResponse.ok) {
          throw new Error(
            projectData.message || "Failed to load projects."
          );
        }

        const task = taskData.task || taskData;
        const projectList =
          projectData.projects || projectData || [];

        setTitle(task.title || "");
        setDescription(task.description || "");
        setPriority(task.priority || "medium");
        setStatus(task.status || "todo");

        if (task.project) {
          setProject(
            typeof task.project === "object"
              ? task.project._id
              : task.project
          );
        }

        setProjects(projectList);
      } catch (err) {
        console.error(err);
        setError("Failed to load task.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, router]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const token = localStorage.getItem("taskflow_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!project) {
      setError("Please select a project.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            project,
            priority,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update task."
        );
      }

      router.push(`/tasks/${id}`);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update task."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <p className="text-slate-400">
            Loading task...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">

        <button
          onClick={() => router.push(`/tasks/${id}`)}
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Task
        </button>

        <div className="mt-8">
          <h1 className="text-3xl font-bold">
            Edit Task
          </h1>

          <p className="mt-2 text-slate-500">
            Update your task information and status.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8"
        >
          {/* TITLE */}
          <div>
            <label className="text-sm font-medium text-slate-300">
              Task Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mt-6">
            <label className="text-sm font-medium text-slate-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe your task..."
              rows={5}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          {/* PROJECT */}
          <div className="mt-6">
            <label className="text-sm font-medium text-slate-300">
              Project
            </label>

            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="">
                Select a project
              </option>

              {projects.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRIORITY + STATUS */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>
              <label className="text-sm font-medium text-slate-300">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 capitalize text-white outline-none focus:border-cyan-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">
                  In Progress
                </option>
                <option value="review">Review</option>
                <option value="completed">
                  Completed
                </option>
              </select>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(`/tasks/${id}`)
              }
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 transition hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}