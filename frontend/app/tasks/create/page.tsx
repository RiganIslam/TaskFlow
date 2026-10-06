"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
ArrowLeft,
CheckSquare,
} from "lucide-react";

type Project = {
_id: string;
name: string;
};

export default function CreateTaskPage() {
const router = useRouter();

const [projects, setProjects] = useState<Project[]>([]);

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [project, setProject] = useState("");
const [priority, setPriority] = useState("low");
const [status, setStatus] = useState("todo");

const [loadingProjects, setLoadingProjects] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
async function loadProjects() {
const token = localStorage.getItem("taskflow_token");


  if (!token) {
    router.replace("/login");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/projects",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load projects."
      );
    }

    const projectList = data.projects || data || [];

    setProjects(projectList);

    if (projectList.length > 0) {
      setProject(projectList[0]._id);
    }
  } catch (err) {
    console.error("Projects error:", err);
    setError("Failed to load projects.");
  } finally {
    setLoadingProjects(false);
  }
}

loadProjects();


}, [router]);

async function handleSubmit(
event: FormEvent<HTMLFormElement>
) {
event.preventDefault();


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

try {
  setSaving(true);
  setError("");

  const response = await fetch(
    "http://localhost:5000/api/tasks",
    {
      method: "POST",
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
      data.message || "Failed to create task."
    );
  }

  router.push("/tasks");
} catch (err) {
  console.error("Create task error:", err);

  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Failed to create task.");
  }
} finally {
  setSaving(false);
}


}

return ( <main className="min-h-screen bg-slate-950 px-6 py-10 text-white"> <div className="mx-auto max-w-2xl">


    <button
      onClick={() => router.push("/tasks")}
      className="mb-8 flex items-center gap-2 text-sm text-slate-500 transition hover:text-cyan-400"
    >
      <ArrowLeft size={17} />
      Back to Tasks
    </button>

    {/* Header */}
    <div className="mb-8">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
        <CheckSquare size={28} />
      </div>

      <h1 className="text-4xl font-bold">
        Create Task
      </h1>

      <p className="mt-3 text-slate-400">
        Add a new task to one of your projects.
      </p>
    </div>

    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
    >

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Task Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="e.g. Build login page"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
        />
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Description
        </label>

        <textarea
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Describe what needs to be done..."
          rows={5}
          className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
        />
      </div>

      {/* Project */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Project
        </label>

        {loadingProjects ? (
          <div className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-500">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-300">
            You need to create a project first.
          </div>
        ) : (
          <select
            value={project}
            onChange={(event) =>
              setProject(event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400/50"
          >
            {projects.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Priority */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Priority
        </label>

        <select
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value)
          }
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400/50"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Status */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Status
        </label>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400/50"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">
            In Progress
          </option>
          <option value="completed">
            Completed
          </option>
        </select>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={() => router.push("/tasks")}
          className="rounded-xl border border-white/10 px-6 py-3 text-slate-300 transition hover:bg-white/10"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving || projects.length === 0}
          className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create Task"}
        </button>

      </div>

    </form>
  </div>
</main>


);
}
