"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  Zap,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters.",
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create account.",
        );
      }

      localStorage.setItem(
        "taskflow_token",
        data.token,
      );

      localStorage.setItem(
        "taskflow_user",
        JSON.stringify(data.user),
      );

      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#070b14] text-white">
      {/* Background */}

      <div className="pointer-events-none absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-[-200px] right-[-150px] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[140px]" />

      {/* Left Side */}

      <section className="relative hidden w-1/2 flex-col justify-between p-12 lg:flex">
        <Link
          href="/"
          className="flex w-fit items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Zap size={21} />
          </div>

          <span className="text-xl font-bold">
            Task
            <span className="text-cyan-400">
              Flow
            </span>
          </span>
        </Link>

        <div className="max-w-lg">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Start your workflow
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Turn your ideas
            <br />
            into{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-purple-500 bg-clip-text text-transparent">
              progress.
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-gray-400">
            Create projects, organize tasks, and
            keep everything moving with TaskFlow.
          </p>

          <div className="mt-10 space-y-4">
            <Benefit text="Organize unlimited projects" />
            <Benefit text="Track tasks with Kanban workflow" />
            <Benefit text="Monitor your project progress" />
          </div>
        </div>

        <p className="text-sm text-gray-600">
          © 2026 TaskFlow
        </p>
      </section>

      {/* Signup Card */}

      <section className="relative flex w-full items-center justify-center px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}

          <Link
            href="/"
            className="mb-10 flex items-center justify-center gap-2 lg:hidden"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600">
              <Zap size={21} />
            </div>

            <span className="text-xl font-bold">
              Task
              <span className="text-cyan-400">
                Flow
              </span>
            </span>
          </Link>

          <div className="rounded-3xl border border-white/10 bg-[#0d1320]/90 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold">
                Create your account
              </h2>

              <p className="mt-2 text-gray-400">
                Start managing your work with
                TaskFlow.
              </p>
            </div>

            {/* Error */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSignup}
              className="space-y-5"
            >
              {/* Name */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Your name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-11 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:bg-white/[0.07]"
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-11 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:bg-white/[0.07]"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value,
                      )
                    }
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-11 py-3.5 pr-12 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:bg-white/[0.07]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-600">
                  Use at least 6 characters.
                </p>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account

                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Sign in */}

            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Benefit({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-gray-300">
      <CheckCircle2
        size={20}
        className="shrink-0 text-cyan-400"
      />

      <span>{text}</span>
    </div>
  );
}