"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  KanbanSquare,
  LayoutDashboard,
  Users,
  Zap,
} from "lucide-react";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

type WorkflowItem = {
  number: string;
  title: string;
  description: string;
};

const workflowItems: WorkflowItem[] = [
  {
    number: "01",
    title: "Create",
    description:
      "Create your project and define what needs to be done.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "Break your project into clear and manageable tasks.",
  },
  {
    number: "03",
    title: "Track",
    description:
      "Move tasks through your Kanban workflow.",
  },
  {
    number: "04",
    title: "Complete",
    description:
      "Finish tasks and watch your progress grow.",
  },
];

function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group rounded-2xl border border-white/10 bg-[#0d1320] p-7 transition hover:border-cyan-400/30"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 transition group-hover:bg-cyan-400/20">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-relaxed text-gray-400">
        {description}
      </p>
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070b14] text-white">
      {/* ================= NAVBAR ================= */}

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#070b14]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Zap
                size={20}
                className="text-white"
              />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Task
              <span className="text-cyan-400">
                Flow
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
            <a
              href="#features"
              className="transition hover:text-cyan-400"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="transition hover:text-cyan-400"
            >
              Workflow
            </a>

            <a
              href="#about"
              className="transition hover:text-cyan-400"
            >
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden px-4 py-2 text-sm text-gray-300 transition hover:text-white sm:block"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section className="relative px-6 pb-24 pt-36">
        <div className="pointer-events-none absolute left-1/2 top-20 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl text-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

            Smart project management
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mx-auto max-w-5xl text-5xl font-bold leading-tight tracking-tight md:text-7xl"
          >
            Manage projects.
            <br />

            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Get things done.
            </span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-gray-400"
          >
            TaskFlow helps you organize projects,
            manage tasks, track progress, and keep
            everything moving in one beautiful
            workspace.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/signup"
              className="group flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-7 py-3.5 font-semibold text-black transition hover:bg-cyan-300"
            >
              Start for free

              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold transition hover:bg-white/10"
            >
              View Dashboard
            </Link>
          </motion.div>

          {/* Dashboard Preview */}

          <motion.div
            initial={{
              opacity: 0,
              y: 60,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.9,
              delay: 0.3,
            }}
            className="mx-auto mt-20 max-w-5xl"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1320] shadow-2xl shadow-cyan-500/10">
              {/* Browser Bar */}

              <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />

                <div className="ml-5 h-7 flex-1 rounded-lg bg-white/5" />
              </div>

              <div className="p-6">
                {/* Stats */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <StatCard
                    label="Projects"
                    value="12"
                  />

                  <StatCard
                    label="Total Tasks"
                    value="86"
                  />

                  <StatCard
                    label="Completed"
                    value="54"
                    valueClass="text-green-400"
                  />

                  <StatCard
                    label="In Progress"
                    value="21"
                    valueClass="text-cyan-400"
                  />
                </div>

                {/* Preview Cards */}

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <PreviewCard
                    icon={
                      <KanbanSquare
                        size={18}
                      />
                    }
                    iconClass="text-cyan-400"
                    title="Kanban Board"
                  >
                    <div className="mt-5 space-y-2">
                      <div className="h-3 w-full rounded bg-white/10" />
                      <div className="h-3 w-4/5 rounded bg-white/10" />
                      <div className="h-3 w-3/5 rounded bg-white/10" />
                    </div>
                  </PreviewCard>

                  <PreviewCard
                    icon={
                      <BarChart3
                        size={18}
                      />
                    }
                    iconClass="text-purple-400"
                    title="Progress"
                  >
                    <div className="mt-6 h-3 rounded-full bg-white/10">
                      <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" />
                    </div>

                    <p className="mt-3 text-sm text-gray-400">
                      75% completed
                    </p>
                  </PreviewCard>

                  <PreviewCard
                    icon={
                      <CheckCircle2
                        size={18}
                      />
                    }
                    iconClass="text-green-400"
                    title="Tasks"
                  >
                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle2 size={15} />
                        Design landing page
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle2 size={15} />
                        Build API
                      </div>
                    </div>
                  </PreviewCard>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section
        id="features"
        className="border-t border-white/5 px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-medium text-cyan-400">
              EVERYTHING YOU NEED
            </p>

            <h2 className="mt-3 text-4xl font-bold md:text-5xl">
              One workspace.
              <br />

              <span className="text-gray-500">
                Zero chaos.
              </span>
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={
                <LayoutDashboard
                  size={24}
                />
              }
              title="Project Management"
              description="Create projects, organize your work, and keep every important detail in one place."
            />

            <FeatureCard
              icon={
                <KanbanSquare
                  size={24}
                />
              }
              title="Kanban Workflow"
              description="Move tasks through Todo, In Progress, Review, and Completed with a clear workflow."
            />

            <FeatureCard
              icon={
                <BarChart3
                  size={24}
                />
              }
              title="Progress Tracking"
              description="See your project progress and task statistics without complicated reports."
            />

            <FeatureCard
              icon={
                <Users size={24} />
              }
              title="Team Collaboration"
              description="Assign tasks and keep your team aligned around the same project goals."
            />

            <FeatureCard
              icon={
                <CheckCircle2
                  size={24}
                />
              }
              title="Task Management"
              description="Manage priorities, deadlines, descriptions, and task status from one place."
            />

            <FeatureCard
              icon={<Zap size={24} />}
              title="Fast & Simple"
              description="A clean workflow designed to help you focus on the work instead of the tool."
            />
          </div>
        </div>
      </section>

      {/* ================= WORKFLOW ================= */}

      <section
        id="workflow"
        className="border-y border-white/5 bg-white/[0.02] px-6 py-24"
      >
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-medium text-cyan-400">
            SIMPLE WORKFLOW
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            From idea to done.
          </h2>

          <div className="mt-16 grid gap-5 md:grid-cols-4">
            {workflowItems.map(
              (item) => (
                <motion.div
                  key={item.number}
                  whileHover={{
                    y: -8,
                  }}
                  className="rounded-2xl border border-white/10 bg-[#0d1320] p-6"
                >
                  <div className="text-sm font-bold text-cyan-400">
                    {item.number}
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    {item.description}
                  </p>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section
        id="about"
        className="px-6 py-28"
      >
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-purple-500/10 p-10 md:p-16">
            <h2 className="text-4xl font-bold md:text-5xl">
              Ready to take control
              <br />
              of your projects?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-gray-400">
              Create your TaskFlow workspace and
              start turning ideas into completed work.
            </p>

            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-7 py-3.5 font-semibold text-black transition hover:bg-cyan-300"
            >
              Create your account

              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Zap
              size={18}
              className="text-cyan-400"
            />

            <span className="font-semibold">
              TaskFlow
            </span>
          </div>

          <p className="text-sm text-gray-500">
            © 2026 TaskFlow. Built for productive
            teams.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ================= SMALL COMPONENTS ================= */

type StatCardProps = {
  label: string;
  value: string;
  valueClass?: string;
};

function StatCard({
  label,
  value,
  valueClass = "",
}: StatCardProps) {
  return (
    <div className="h-28 rounded-xl border border-white/5 bg-white/5 p-5 text-left">
      <p className="text-sm text-gray-400">
        {label}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

type PreviewCardProps = {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  children: React.ReactNode;
};

function PreviewCard({
  icon,
  iconClass,
  title,
  children,
}: PreviewCardProps) {
  return (
    <div className="h-40 rounded-xl border border-white/5 bg-white/5 p-5 text-left">
      <div
        className={`flex items-center gap-2 ${iconClass}`}
      >
        {icon}

        <span className="font-medium text-white">
          {title}
        </span>
      </div>

      {children}
    </div>
  );
}