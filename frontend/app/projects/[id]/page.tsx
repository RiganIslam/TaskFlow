"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
ArrowLeft,
FolderKanban,
Pencil,
Trash2,
CheckCircle2,
} from "lucide-react";

type Project = {
_id: string;
name: string;
description?: string;
status?: "active" | "completed" | "archived";
createdAt?: string;
updatedAt?: string;
};

export default function ProjectDetailsPage() {
const params = useParams();
const router = useRouter();

const id = params.id as string;

const [project, setProject] = useState<Project | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
async function loadProject() {
const token = localStorage.getItem("taskflow_token");


  if (!token) {
    router.replace("/login");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/projects/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load project."
      );
    }

    setProject(data.project || data);
  } catch (err) {
    console.error("Project details error:", err);
    setError("Failed to load project.");
  } finally {
    setLoading(false);
  }
}

if (id) {
  loadProject();
}


}, [id, router]);

async function handleDelete() {
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

  router.push("/projects");
} catch (err) {
  console.error("Delete error:", err);
  alert("Failed to delete project.");
}


}

if (loading) {
return ( <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white"> <p className="text-slate-500">
Loading project... </p> </main>
);
}

if (error || !project) {
return ( <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white"> <div className="text-center"> <h1 className="text-2xl font-bold">
Project not found </h1>


      <p className="mt-3 text-slate-500">
        {error || "This project does not exist."}
      </p>

      <button
        onClick={() => router.push("/projects")}
        className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
      >
        Back to Projects
      </button>
    </div>
  </main>
);


}

const status = project.status || "active";

return ( <main className="min-h-screen bg-slate-950 text-white"> <div className="mx-auto max-w-5xl px-6 py-10">


    {/* Back */}
    <button
      onClick={() => router.push("/projects")}
      className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-cyan-400"
    >
      <ArrowLeft size={17} />
      Back to Projects
    </button>

    {/* Header */}
    <div className="mt-10 flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-start md:justify-between">

      <div className="flex gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
          <FolderKanban size={30} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">
              {project.name}
            </h1>

            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs capitalize text-cyan-400">
              {status}
            </span>
          </div>

          <p className="mt-3 max-w-2xl text-slate-400">
            {project.description ||
              "No description added yet."}
          </p>
        </div>
      </div>

      <div className="flex gap-3">

        <button
          onClick={() =>
            router.push(`/projects/${id}/edit`)
          }
          className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
        >
          <Trash2 size={16} />
          Delete
        </button>

      </div>
    </div>

    {/* Project Info */}
    <div className="mt-10 grid gap-6 md:grid-cols-2">

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm text-slate-500">
          Project Status
        </p>

        <div className="mt-4 flex items-center gap-3">
          <CheckCircle2 className="text-cyan-400" size={22} />

          <span className="text-lg font-semibold capitalize">
            {status}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm text-slate-500">
          Created
        </p>

        <p className="mt-4 text-lg font-semibold">
          {project.createdAt
            ? new Date(
                project.createdAt
              ).toLocaleDateString()
            : "Unknown"}
        </p>
      </div>

    </div>

    {/* Tasks Placeholder */}
    <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">

      <h2 className="text-xl font-semibold">
        Project Tasks
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Tasks for this project will appear here.
      </p>

      <button
        onClick={() => router.push("/tasks")}
        className="mt-5 rounded-xl bg-cyan-400 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        Go to Tasks
      </button>

    </div>

  </div>
</main>


);
}
