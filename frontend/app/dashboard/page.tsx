"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  KanbanSquare,
  ListTodo,
  LogOut,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Eye,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

type DashboardStats = {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  reviewTasks: number;
  highPriorityTasks: number;
  completionPercentage: number;
};

type RecentTask = {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  project?: {
    _id: string;
    name: string;
  };
};

type RecentProject = {
  _id: string;
  name: string;
  description?: string;
  status: string;
  taskCount: number;
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function DashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    reviewTasks: 0,
    highPriorityTasks: 0,
    completionPercentage: 0,
  });

  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);
  const [recentProjects, setRecentProjects] = useState<
    RecentProject[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("taskflow_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load dashboard"
          );
        }

        setStats(data.stats || {});
        setRecentTasks(data.recentTasks || []);
        setRecentProjects(data.recentProjects || []);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");

    router.push("/login");
  };

  const getUserName = () => {
    if (typeof window === "undefined") {
      return "there";
    }

    try {
      const user = localStorage.getItem("taskflow_user");

      if (!user) {
        return "there";
      }

      const parsedUser = JSON.parse(user);

      return parsedUser?.name || "there";
    } catch {
      return "there";
    }
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
        return "bg-slate-500/10 text-slate-300 border-slate-500/20";

      case "in-progress":
        return "bg-blue-500/10 text-blue-300 border-blue-500/20";

      case "review":
        return "bg-violet-500/10 text-violet-300 border-violet-500/20";

      case "completed":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";

      default:
        return "bg-white/5 text-slate-300 border-white/10";
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-rose-300 bg-rose-500/10 border-rose-500/20";

      case "medium":
        return "text-amber-300 bg-amber-500/10 border-amber-500/20";

      case "low":
        return "text-emerald-300 bg-emerald-500/10 border-emerald-500/20";

      default:
        return "text-slate-300 bg-white/5 border-white/10";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070a12] text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>

            <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl" />
          </div>

          <p className="text-sm text-slate-400">
            Preparing your workspace...
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070a12] text-white overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />

        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />

        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="relative z-20 border-b border-white/[0.07] bg-[#070a12]/80 backdrop-blur-2xl">
        <div className="max-w-[1500px] mx-auto px-5 sm:px-8 py-4">
          <div className="flex items-center justify-between gap-5">
            {/* Logo */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Target className="w-5 h-5" />
                </div>

                <div className="absolute inset-0 bg-blue-500/20 blur-xl -z-10" />
              </div>

              <div>
                <h1 className="font-bold tracking-tight">
                  TaskFlow
                </h1>

                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Workspace
                </p>
              </div>
            </Link>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setSearchOpen(!searchOpen)
                }
                className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] transition"
              >
                <Search className="w-4 h-4 text-slate-400" />
              </button>

              <div className="hidden sm:block h-6 w-px bg-white/10 mx-2" />

              <div className="hidden md:block text-right mr-2">
                <p className="text-sm font-medium">
                  {getUserName()}
                </p>

                <p className="text-[11px] text-slate-500">
                  Workspace member
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-rose-500/10 hover:border-rose-500/20 transition flex items-center justify-center"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Search */}
          <motion.div
            initial={false}
            animate={{
              height: searchOpen ? "auto" : 0,
              opacity: searchOpen ? 1 : 0,
            }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                <input
                  placeholder="Search your workspace..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-11 py-3 text-sm outline-none focus:border-blue-500/40 transition"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-[1500px] mx-auto px-5 sm:px-8 py-8">
        {/* Hero */}
        <motion.section
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-300 text-xs mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Workspace active
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Good to see you,{" "}
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  {getUserName()}
                </span>
                .
              </h2>

              <p className="text-slate-400 mt-3 max-w-2xl text-sm sm:text-base">
                Here&apos;s a clear overview of your projects,
                tasks and current progress.
              </p>
            </div>

            <Link
              href="/tasks/create"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-200 transition shadow-xl shadow-black/20"
            >
              <Plus className="w-4 h-4" />
              New Task
            </Link>
          </div>
        </motion.section>

        {/* Main Stats */}
        <motion.section
          initial="hidden"
          animate="visible"
          transition={{
            staggerChildren: 0.08,
            delayChildren: 0.1,
          }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
        >
          {/* Projects */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.45 }}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 group"
          >
            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-blue-400" />
                </div>

                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition" />
              </div>

              <p className="text-sm text-slate-500 mt-5">
                Total Projects
              </p>

              <div className="flex items-end gap-2 mt-1">
                <p className="text-3xl font-bold">
                  {stats.totalProjects}
                </p>

                <span className="text-xs text-blue-400 mb-1">
                  workspace
                </span>
              </div>
            </div>
          </motion.div>

          {/* Tasks */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.45 }}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 group"
          >
            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-violet-500/10 blur-3xl group-hover:bg-violet-500/20 transition" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/10 flex items-center justify-center">
                  <ListTodo className="w-5 h-5 text-violet-400" />
                </div>

                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition" />
              </div>

              <p className="text-sm text-slate-500 mt-5">
                Total Tasks
              </p>

              <div className="flex items-end gap-2 mt-1">
                <p className="text-3xl font-bold">
                  {stats.totalTasks}
                </p>

                <span className="text-xs text-violet-400 mb-1">
                  tracked
                </span>
              </div>
            </div>
          </motion.div>

          {/* Completed */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.45 }}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 group"
          >
            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>

                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>

              <p className="text-sm text-slate-500 mt-5">
                Completed
              </p>

              <div className="flex items-end gap-2 mt-1">
                <p className="text-3xl font-bold">
                  {stats.completedTasks}
                </p>

                <span className="text-xs text-emerald-400 mb-1">
                  finished
                </span>
              </div>
            </div>
          </motion.div>

          {/* Completion */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.45 }}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 group"
          >
            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-cyan-500/10 blur-3xl group-hover:bg-cyan-500/20 transition" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-cyan-400" />
                </div>

                <span className="text-xs text-cyan-400">
                  {stats.completionPercentage}%
                </span>
              </div>

              <p className="text-sm text-slate-500 mt-5">
                Completion Rate
              </p>

              <div className="h-1.5 rounded-full bg-white/5 mt-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${stats.completionPercentage}%`,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.5,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400"
                />
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial="hidden"
          animate="visible"
          transition={{
            staggerChildren: 0.08,
            delayChildren: 0.3,
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
        >
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/projects/create"
              className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.025] hover:bg-blue-500/[0.06] hover:border-blue-500/20 transition group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Plus className="w-4 h-4 text-blue-400" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">
                  Create Project
                </p>

                <p className="text-xs text-slate-500">
                  Start something new
                </p>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>

          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/tasks/create"
              className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.025] hover:bg-violet-500/[0.06] hover:border-violet-500/20 transition group"
            >
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <ListTodo className="w-4 h-4 text-violet-400" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">
                  Create Task
                </p>

                <p className="text-xs text-slate-500">
                  Add work to your flow
                </p>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>

          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/projects"
              className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.025] hover:bg-cyan-500/[0.06] hover:border-cyan-500/20 transition group"
            >
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <FolderKanban className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">
                  View Projects
                </p>

                <p className="text-xs text-slate-500">
                  Manage your workspace
                </p>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>

          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/kanban"
              className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.025] hover:bg-emerald-500/[0.06] hover:border-emerald-500/20 transition group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <KanbanSquare className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">
                  Open Kanban
                </p>

                <p className="text-xs text-slate-500">
                  Move tasks through flow
                </p>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>
        </motion.section>

        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Task Overview */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">
                  Task Overview
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Current workload distribution
                </p>
              </div>

              <Link
                href="/tasks"
                className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
              >
                All tasks
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-5">
              {/* Todo */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />

                    <span className="text-sm text-slate-300">
                      Todo
                    </span>
                  </div>

                  <span className="text-sm font-medium">
                    {stats.todoTasks}
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        stats.totalTasks > 0
                          ? `${
                              (stats.todoTasks /
                                stats.totalTasks) *
                              100
                            }%`
                          : "0%",
                    }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="h-full rounded-full bg-slate-400"
                  />
                </div>
              </div>

              {/* In Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />

                    <span className="text-sm text-slate-300">
                      In Progress
                    </span>
                  </div>

                  <span className="text-sm font-medium">
                    {stats.inProgressTasks}
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        stats.totalTasks > 0
                          ? `${
                              (stats.inProgressTasks /
                                stats.totalTasks) *
                              100
                            }%`
                          : "0%",
                    }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="h-full rounded-full bg-blue-500"
                  />
                </div>
              </div>

              {/* Review */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-400" />

                    <span className="text-sm text-slate-300">
                      Review
                    </span>
                  </div>

                  <span className="text-sm font-medium">
                    {stats.reviewTasks}
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        stats.totalTasks > 0
                          ? `${
                              (stats.reviewTasks /
                                stats.totalTasks) *
                              100
                            }%`
                          : "0%",
                    }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="h-full rounded-full bg-violet-500"
                  />
                </div>
              </div>

              {/* Completed */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />

                    <span className="text-sm text-slate-300">
                      Completed
                    </span>
                  </div>

                  <span className="text-sm font-medium">
                    {stats.completedTasks}
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        stats.totalTasks > 0
                          ? `${
                              (stats.completedTasks /
                                stats.totalTasks) *
                              100
                            }%`
                          : "0%",
                    }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="h-full rounded-full bg-emerald-500"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Productivity */}
          <motion.section
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue-500/[0.08] via-violet-500/[0.06] to-cyan-500/[0.04] p-6"
          >
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Productivity
              </div>

              <div className="flex items-center justify-center py-8">
                <div className="relative w-40 h-40">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="7"
                      className="text-white/5"
                    />

                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray="264"
                      initial={{ strokeDashoffset: 264 }}
                      animate={{
                        strokeDashoffset:
                          264 -
                          (264 *
                            stats.completionPercentage) /
                            100,
                      }}
                      transition={{
                        duration: 1.2,
                        delay: 0.6,
                        ease: "easeOut",
                      }}
                    />

                    <defs>
                      <linearGradient
                        id="progressGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">
                      {stats.completionPercentage}%
                    </span>

                    <span className="text-[11px] text-slate-500">
                      complete
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/[0.07] pt-4">
                <p className="text-sm text-slate-300">
                  Keep the momentum going.
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  You have{" "}
                  <span className="text-slate-300">
                    {stats.highPriorityTasks}
                  </span>{" "}
                  high-priority{" "}
                  {stats.highPriorityTasks === 1
                    ? "task"
                    : "tasks"}{" "}
                  to focus on.
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Recent Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Recent Tasks */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.035] overflow-hidden"
          >
            <div className="p-6 border-b border-white/[0.07] flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  Recent Tasks
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Latest activity in your workspace
                </p>
              </div>

              <Link
                href="/tasks"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
              >
                View all
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-4">
              {recentTasks.length === 0 ? (
                <div className="py-12 text-center">
                  <ListTodo className="w-10 h-10 mx-auto text-slate-700" />

                  <p className="text-sm text-slate-500 mt-3">
                    No tasks yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentTasks.map((task, index) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.65 + index * 0.07,
                      }}
                    >
                      <Link
                        href={`/tasks/${task._id}`}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.04] transition group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                          <ListTodo className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium truncate">
                            {task.title}
                          </h4>

                          <p className="text-xs text-slate-500 mt-1 truncate">
                            {task.project?.name ||
                              "No project"}
                          </p>
                        </div>

                        <div className="hidden sm:flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-md border text-[10px] ${getPriorityClass(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>

                          <span
                            className={`px-2 py-1 rounded-md border text-[10px] ${getStatusClass(
                              task.status
                            )}`}
                          >
                            {getStatusLabel(task.status)}
                          </span>
                        </div>

                        <Eye className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>

          {/* Recent Projects */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.035] overflow-hidden"
          >
            <div className="p-6 border-b border-white/[0.07] flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  Recent Projects
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Your latest active workspaces
                </p>
              </div>

              <Link
                href="/projects"
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition"
              >
                View all
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-4">
              {recentProjects.length === 0 ? (
                <div className="py-12 text-center">
                  <FolderKanban className="w-10 h-10 mx-auto text-slate-700" />

                  <p className="text-sm text-slate-500 mt-3">
                    No projects yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentProjects.map(
                    (project, index) => (
                      <motion.div
                        key={project._id}
                        initial={{
                          opacity: 0,
                          x: 10,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: 0.7 + index * 0.07,
                        }}
                      >
                        <Link
                          href={`/projects/${project._id}`}
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.04] transition group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/10 flex items-center justify-center shrink-0">
                            <FolderKanban className="w-4 h-4 text-violet-400" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium truncate">
                              {project.name}
                            </h4>

                            <p className="text-xs text-slate-500 mt-1">
                              {project.taskCount}{" "}
                              {project.taskCount === 1
                                ? "task"
                                : "tasks"}
                            </p>
                          </div>

                          <span className="hidden sm:block px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/10 text-blue-300 text-[10px]">
                            {project.status}
                          </span>

                          <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-violet-400 group-hover:translate-x-1 transition" />
                        </Link>
                      </motion.div>
                    )
                  )}
                </div>
              )}
            </div>
          </motion.section>
        </div>

        {/* Bottom Insight */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.025]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>

            <div>
              <p className="text-sm font-medium">
                Focus on what matters
              </p>

              <p className="text-xs text-slate-500 mt-0.5">
                Review your high-priority tasks to keep
                your projects moving.
              </p>
            </div>
          </div>

          <Link
            href="/tasks"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-xs font-medium transition"
          >
            Review Tasks
            <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}