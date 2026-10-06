"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderPlus } from "lucide-react";

export default function CreateProjectPage() {
const router = useRouter();

const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [status, setStatus] = useState("active");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();


const token = localStorage.getItem("taskflow_token");

if (!token) {
  router.replace("/login");
  return;
}

if (!name.trim()) {
  setError("Project name is required.");
  return;
}

try {
  setLoading(true);
  setError("");

  const response = await fetch(
    "http://localhost:5000/api/projects",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create project."
    );
  }

  router.push("/projects");
} catch (err) {
  console.error("Create project error:", err);

  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Failed to create project.");
  }
} finally {
  setLoading(false);
}


}

return ( <main className="min-h-screen bg-slate-950 px-6 py-10 text-white"> <div className="mx-auto max-w-2xl">


    {/* Back */}
    <button
      onClick={() => router.push("/projects")}
      className="mb-8 flex items-center gap-2 text-sm text-slate-500 transition hover:text-cyan-400"
    >
      <ArrowLeft size={17} />
      Back to Projects
    </button>

    {/* Header */}
    <div className="mb-8">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
        <FolderPlus size={28} />
      </div>

      <h1 className="text-4xl font-bold">
        Create Project
      </h1>

      <p className="mt-3 text-slate-400">
        Create a new project and start organizing your work.
      </p>
    </div>

    {/* Form */}
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
    >

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Project Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="e.g. TaskFlow Website"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50"
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
          placeholder="Describe your project..."
          rows={5}
          className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50"
        />
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
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={() => router.push("/projects")}
          className="rounded-xl border border-white/10 px-6 py-3 font-medium text-slate-300 transition hover:bg-white/10"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>

      </div>

    </form>
  </div>
</main>


);
}
