"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function EditProjectPage() {
const params = useParams();
const router = useRouter();

const id = params.id as string;

const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [status, setStatus] = useState("active");

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
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

    const project = data.project || data;

    setName(project.name || "");
    setDescription(project.description || "");
    setStatus(project.status || "active");
  } catch (err) {
    console.error("Load project error:", err);
    setError("Failed to load project.");
  } finally {
    setLoading(false);
  }
}

if (id) {
  loadProject();
}


}, [id, router]);

async function handleSubmit(
event: FormEvent<HTMLFormElement>
) {
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
  setSaving(true);
  setError("");

  const response = await fetch(
    `http://localhost:5000/api/projects/${id}`,
    {
      method: "PUT",
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
      data.message || "Failed to update project."
    );
  }

  router.push(`/projects/${id}`);
} catch (err) {
  console.error("Update project error:", err);

  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Failed to update project.");
  }
} finally {
  setSaving(false);
}


}

if (loading) {
return ( <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white"> <p className="text-slate-500">
Loading project... </p> </main>
);
}

return ( <main className="min-h-screen bg-slate-950 px-6 py-10 text-white"> <div className="mx-auto max-w-2xl">


    <button
      onClick={() => router.push(`/projects/${id}`)}
      className="mb-8 flex items-center gap-2 text-sm text-slate-500 transition hover:text-cyan-400"
    >
      <ArrowLeft size={17} />
      Back to Project
    </button>

    <h1 className="text-4xl font-bold">
      Edit Project
    </h1>

    <p className="mt-3 text-slate-400">
      Update your project information.
    </p>

    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
    >

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

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
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Description
        </label>

        <textarea
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={5}
          className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
        />
      </div>

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

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={() =>
            router.push(`/projects/${id}`)
          }
          className="rounded-xl border border-white/10 px-6 py-3 text-slate-300 transition hover:bg-white/10"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={17} />

          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </form>
  </div>
</main>


);
}
