"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
Plus,
FolderKanban,
ArrowRight,
Trash2,
Pencil,
} from "lucide-react";
import { main } from "framer-motion/m";

type Project = {
_id: string;
name: string;
description?: string;
status?: "active" | "completed" | "archived";
};

export default function ProjectsPage() {
const router = useRouter();

const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

async function loadProjects() {
const token = localStorage.getItem("taskflow_token");


if (!token) {
  router.replace("/login");
  return;
}

try {
  setLoading(true);
  setError("");

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

  setProjects(data.projects || data || []);
} catch (err) {
  console.error("Projects error:", err);
  setError("Failed to load projects.");
} finally {
  setLoading(false);
}


}

useEffect(() => {
loadProjects();
}, []);

async function handleDelete(id: string) {
const token = localStorage.getItem("taskflow_token");


if (!token) {
  router.replace("/login");
  return;
}

const confirmed = window.confirm(
  "Are you sure you want to delete this project?"
);

if (!confirmed) return;

try {
  const response = await fetch(
    `http://localhost:5000/api/projects/${id}`,
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
      data.message || "Failed to delete project."
    );
  }

  setProjects((current) =>
    current.filter((project) => project._id !== id)
  );
} catch (err) {
  console.error("Delete project error:", err);
  alert("Failed to delete project.");
}


}

function getStatusStyle(status?: string) {
if (status === "completed") {
return "bg-green-400/10 text-green-400 border-green-400/20";
}


if (status === "archived") {
  return "bg-slate-400/10 text-slate-400 border-slate-400/20";
}

return "bg-cyan-400/10 text-cyan-400 border-cyan-400/20";


}

return ( <main className="min-h-screen bg-slate-950 text-white"> <div className="mx-auto max-w-6xl px-6 py-8">

    {/* Header */}
    <div className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-3 text-sm text-slate-500 transition hover:text-cyan-400"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold">
          Projects
        </h1>

        <p className="mt-2 text-slate-400">
          Create and manage your projects.
        </p>
      </div>

      <button
        onClick={() => router.push("/projects/create")}
        className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        <Plus size={19} />
        New Project
      </button>
    </div>

    {/* Error */}
    {error && (
      <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
        {error}
      </div>
    )}

    {/* Loading */}
    {loading && (
      <div className="py-20 text-center text-slate-500">
        Loading projects...
      </div>
    )}

    {/* Empty */}
    {!loading && projects.length === 0 && !error && (
      <div className="mt-12 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
          <FolderKanban size={30} />
        </div>

        <h2 className="mt-6 text-2xl font-semibold">
          No projects yet
        </h2>

        <p className="mx-auto mt-3 max-w-md text-slate-500">
          Create your first project and start organizing
          your tasks with TaskFlow.
        </p>

        <button
          onClick={() => router.push("/projects/create")}
          className="mt-7 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Create Project
        </button>
      </div>
    )}

    {/* Projects */}
    {!loading && projects.length > 0 && (
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {projects.map((project) => (
          <div
            key={project._id}
            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
          >
            <div className="flex items-start justify-between gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                <FolderKanban size={22} />
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs capitalize ${getStatusStyle(
                  project.status
                )}`}
              >
                {project.status || "active"}
              </span>
            </div>

            <h2 className="mt-6 text-xl font-semibold">
              {project.name}
            </h2>

            <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
              {project.description ||
                "No description added yet."}
            </p>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5">

              <button
                onClick={() =>
                  router.push(
                    `/projects/${project._id}/edit`
                  )
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
              >
                <Pencil size={15} />
                Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(project._id)
                }
                className="flex items-center justify-center rounded-lg border border-red-500/10 px-3 py-2 text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 size={16} />
              </button>

              <button
                onClick={() =>
                  router.push(
                    `/projects/${project._id}`
                  )
                }
                className="flex items-center justify-center rounded-lg bg-cyan-400/10 px-3 py-2 text-cyan-400 transition hover:bg-cyan-400/20"
              >
                <ArrowRight size={17} />
              </button>

            </div>
          </div>
        ))}

      </div>
    )}

  </div>
</main>


);
}
