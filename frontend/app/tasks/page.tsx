"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  Eye,
  ListTodo,
  ArrowLeft,
  Filter,
} from "lucide-react";

type Project = {
  _id: string;
  name: string;
};

type Task = {
  _id: string;
  title: string;
  description?: string;
  project?: Project | string;
  priority: string;
  status: string;
};

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("taskflow_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [tasksResponse, projectsResponse] = await Promise.all([
          fetch("http://localhost:5000/api/tasks", {
            headers,
          }),

          fetch("http://localhost:5000/api/projects", {
            headers,
          }),
        ]);

        const tasksData = await tasksResponse.json();
        const projectsData = await projectsResponse.json();

        if (!tasksResponse.ok) {
          throw new Error(
            tasksData.message || "Failed to load tasks"
          );
        }

        if (!projectsResponse.ok) {
          throw new Error(
            projectsData.message || "Failed to load projects"
          );
        }

        setTasks(tasksData.tasks || tasksData || []);
        setProjects(projectsData.projects || projectsData || []);
      } catch (error) {
        console.error("Failed to load task data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const deleteTask = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("taskflow_token");

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
        throw new Error(data.message || "Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== id)
      );
    } catch (error) {
      console.error("Delete task error:", error);

      alert("Failed to delete task.");
    }
  };

  const getProjectName = (task: Task) => {
    if (!task.project) {
      return "No project";
    }

    if (typeof task.project === "object") {
      return task.project.name;
    }

    const project = projects.find(
      (item) => item._id === task.project
    );

    return project?.name || "Unknown project";
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "Todo";

      case "in-progress":
        return "In Progress";

      case "review":
        return "Review";

      case "completed":
        return "Completed";

      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-slate-100 text-slate-700";

      case "in-progress":
        return "bg-blue-100 text-blue-700";

      case "review":
        return "bg-purple-100 text-purple-700";

      case "completed":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";

      case "medium":
        return "bg-yellow-100 text-yellow-700";

      case "low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        task.title.toLowerCase().includes(searchText) ||
        task.description?.toLowerCase().includes(searchText) ||
        getProjectName(task).toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;

      const projectId =
        typeof task.project === "object"
          ? task.project?._id
          : task.project;

      const matchesProject =
        projectFilter === "all" ||
        projectId === projectFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesProject
      );
    });
  }, [
    tasks,
    projects,
    search,
    statusFilter,
    priorityFilter,
    projectFilter,
  ]);

  const todoCount = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const progressCount = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const reviewCount = tasks.filter(
    (task) => task.status === "review"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading tasks...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            <h1 className="text-4xl font-bold">
              Tasks
            </h1>

            <p className="text-slate-400 mt-2">
              Manage and organize all your tasks.
            </p>
          </div>

          <Link
            href="/tasks/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Task
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-sm text-slate-400">
              Todo
            </p>

            <p className="text-3xl font-bold mt-2">
              {todoCount}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-sm text-slate-400">
              In Progress
            </p>

            <p className="text-3xl font-bold mt-2">
              {progressCount}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-sm text-slate-400">
              Review
            </p>

            <p className="text-3xl font-bold mt-2">
              {reviewCount}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-sm text-slate-400">
              Completed
            </p>

            <p className="text-3xl font-bold mt-2">
              {completedCount}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-400" />

            <h2 className="font-semibold">
              Search & Filter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="px-4 py-3 rounded-xl bg-slate-900 border border-white/10 outline-none focus:border-blue-500"
            >
              <option value="all">
                All Status
              </option>

              <option value="todo">
                Todo
              </option>

              <option value="in-progress">
                In Progress
              </option>

              <option value="review">
                Review
              </option>

              <option value="completed">
                Completed
              </option>
            </select>

            {/* Priority */}
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
              className="px-4 py-3 rounded-xl bg-slate-900 border border-white/10 outline-none focus:border-blue-500"
            >
              <option value="all">
                All Priority
              </option>

              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>
            </select>

            {/* Project */}
            <select
              value={projectFilter}
              onChange={(e) =>
                setProjectFilter(e.target.value)
              }
              className="px-4 py-3 rounded-xl bg-slate-900 border border-white/10 outline-none focus:border-blue-500"
            >
              <option value="all">
                All Projects
              </option>

              {projects.map((project) => (
                <option
                  key={project._id}
                  value={project._id}
                >
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-400">
            Showing{" "}
            <span className="text-white font-semibold">
              {filteredTasks.length}
            </span>{" "}
            of{" "}
            <span className="text-white font-semibold">
              {tasks.length}
            </span>{" "}
            tasks
          </p>
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 ? (
          <div className="py-20 rounded-2xl bg-white/5 border border-white/10 text-center">
            <ListTodo className="w-14 h-14 mx-auto text-slate-600" />

            <h2 className="text-xl font-semibold mt-5">
              No tasks found
            </h2>

            <p className="text-slate-400 mt-2">
              Try changing your search or filters.
            </p>

            {tasks.length === 0 && (
              <Link
                href="/tasks/create"
                className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition"
              >
                <Plus className="w-5 h-5" />
                Create your first task
              </Link>
            )}
          </div>
        ) : (
          /* Task Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/tasks/${task._id}`}
                    className="min-w-0"
                  >
                    <h2 className="text-lg font-semibold truncate group-hover:text-blue-400 transition">
                      {task.title}
                    </h2>
                  </Link>

                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(
                      task.status
                    )}`}
                  >
                    {getStatusLabel(task.status)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 mt-3 line-clamp-2 min-h-[40px]">
                  {task.description ||
                    "No description provided."}
                </p>

                {/* Project */}
                <div className="mt-5">
                  <p className="text-xs text-slate-500">
                    Project
                  </p>

                  <p className="text-sm text-slate-300 mt-1 truncate">
                    {getProjectName(task)}
                  </p>
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-medium ${getPriorityClass(
                      task.priority
                    )}`}
                  >
                    {task.priority} priority
                  </span>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/tasks/${task._id}`}
                      className="p-2 rounded-lg hover:bg-white/10 transition"
                      title="View task"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/tasks/${task._id}/edit`}
                      className="p-2 rounded-lg hover:bg-white/10 transition"
                      title="Edit task"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() =>
                        deleteTask(task._id)
                      }
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}