"use client";

import { useState } from "react";
import { register } from "@/lib/actions/auth";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  UserPlus,
  CheckSquare,
} from "lucide-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<
    Record<string, string[]>
  >({});

  const [success, setSuccess] = useState("");

  const [showPass, setShowPass] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    setError({});

    setSuccess("");

    const formData = new FormData(
      e.currentTarget
    );

    const result = await register(formData);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <CheckSquare className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Pengingat Deadline
          </h1>

          <p className="text-blue-200 mt-2">
            Buat akun baru kamu
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Daftar
          </h2>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-5 text-sm flex items-start gap-2">
              <span className="mt-0.5">✅</span>

              <span>
                {success}{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold underline"
                >
                  Login sekarang
                </Link>
              </span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* NAMA */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap
              </label>

              <input
                name="nama"
                type="text"
                required
                placeholder="Nama kamu"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 placeholder-gray-400"
              />

              {error?.nama && (
                <p className="text-red-500 text-sm mt-1">
                  {error.nama[0]}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>

              <input
                name="email"
                type="email"
                required
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 placeholder-gray-400"
              />

              {error?.email && (
                <p className="text-red-500 text-sm mt-1">
                  {error.email[0]}
                </p>
              )}
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
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
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

              {error?.password && (
                <p className="text-red-500 text-sm mt-1">
                  {error.password[0]}
                </p>
              )}
            </div>

            {/* BUTTON */}
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
                  <UserPlus size={18} />

                  <span>Daftar</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Sudah punya akun?{" "}
            <Link
              href="/auth/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}