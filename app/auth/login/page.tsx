"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/actions/auth";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  LogIn,
  CheckSquare,
} from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPass, setShowPass] =
    useState(false);

  const searchParams = useSearchParams();

  const redirectTo =
    searchParams.get("redirectTo") ||
    "/dashboard";

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(
      e.currentTarget
    );

    const result = await login(formData);

    // ZOD VALIDATION ERROR
    if (result?.error) {
      const firstError =
        result.error.email?.[0] ||
        result.error.password?.[0] ||
        "Form tidak valid";

      setError(firstError);
      setLoading(false);
      return;
    }

    // SERVER ERROR
    if (result?.serverError) {
      setError(result.serverError);
      setLoading(false);
      return;
    }

    // SUCCESS
    // Redirect handled by server action
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <CheckSquare className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Pengingat Deadline
          </h1>

          <p className="text-blue-200 mt-2">
            Kelola tugas dan deadline kamu
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Masuk
          </h2>

          {/* ERROR */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm flex items-start gap-2">
              <span className="mt-0.5">
                ⚠️
              </span>

              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* URL AS STATE */}
            <input
              type="hidden"
              name="redirectTo"
              value={redirectTo}
            />

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>

              <input
                name="email"
                type="email"
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  name="password"
                  type={
                    showPass
                      ? "text"
                      : "password"
                  }
                  placeholder="Masukkan password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 placeholder-gray-400 pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPass(!showPass)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                  <span>
                    Memproses...
                  </span>
                </>
              ) : (
                <>
                  <LogIn size={18} />

                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>

          {/* REGISTER */}
          <p className="text-center text-gray-600 mt-6 text-sm">
            Belum punya akun?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}