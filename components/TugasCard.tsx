"use client";

import { useState } from "react";
import { Tugas } from "@/types";
import {
  toggleSelesai,
  hapusTugas,
} from "@/lib/actions/tugas";

import {
  format,
  isPast,
  isToday,
} from "date-fns";

import { id } from "date-fns/locale";

import {
  CheckCircle2,
  Circle,
  Trash2,
  Clock,
  AlertCircle,
} from "lucide-react";

import Toast from "./Toast";
import clsx from "clsx";

const prioritasConfig = {
  rendah: {
    label: "Rendah",
    color:
      "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-400",
  },

  sedang: {
    label: "Sedang",
    color:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-400",
  },

  tinggi: {
    label: "Tinggi",
    color:
      "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-400",
  },
};

export default function TugasCard({
  tugas,
  onDeleteOptimistic,
}: {
  tugas: Tugas;
  onDeleteOptimistic?: (id: string) => void;
}) {
  const [loadingToggle, setLoadingToggle] =
    useState(false);

  const [loadingDelete, setLoadingDelete] =
    useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const deadline = new Date(tugas.deadline);

  const isOverdue =
    isPast(deadline) &&
    !isToday(deadline) &&
    !tugas.selesai;

  const isDueToday =
    isToday(deadline) && !tugas.selesai;

  const pConfig =
    prioritasConfig[tugas.prioritas];

  async function handleToggle() {
    setLoadingToggle(true);

    const result = await toggleSelesai(
      tugas.id,
      tugas.selesai
    );

    setLoadingToggle(false);

    if (result?.error) {
      setToast({
        message: result.error,
        type: "error",
      });
    }
  }

  async function handleDelete() {
    if (!confirm("Hapus tugas ini?")) return;

    // OPTIMISTIC UI
    onDeleteOptimistic?.(tugas.id);

    setLoadingDelete(true);

    const result = await hapusTugas(tugas.id);

    setLoadingDelete(false);

    if (result?.error) {
      setToast({
        message: result.error,
        type: "error",
      });
    }
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div
        className={clsx(
          "bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all",

          tugas.selesai
            ? "opacity-60 border-gray-100"
            : isOverdue
            ? "border-red-200 bg-red-50/30"
            : isDueToday
            ? "border-orange-200 bg-orange-50/30"
            : "border-gray-100"
        )}
      >
        <div className="flex items-start gap-3">
          {/* CHECKBOX */}
          <button
            onClick={handleToggle}
            disabled={loadingToggle}
            className="mt-0.5 shrink-0 transition hover:scale-110"
          >
            {loadingToggle ? (
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : tugas.selesai ? (
              <CheckCircle2
                size={22}
                className="text-green-500"
              />
            ) : (
              <Circle
                size={22}
                className="text-gray-300 hover:text-blue-400"
              />
            )}
          </button>

          {/* CONTENT */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={clsx(
                  "font-semibold text-gray-800 text-sm leading-snug",

                  tugas.selesai &&
                    "line-through text-gray-400"
                )}
              >
                {tugas.judul}
              </h3>

              <button
                onClick={handleDelete}
                disabled={loadingDelete}
                className="shrink-0 text-gray-300 hover:text-red-500 transition"
              >
                {loadingDelete ? (
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>

            {tugas.deskripsi && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {tugas.deskripsi}
              </p>
            )}

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {/* PRIORITAS */}
              <span
                className={clsx(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                  pConfig.color
                )}
              >
                <span
                  className={clsx(
                    "w-1.5 h-1.5 rounded-full",
                    pConfig.dot
                  )}
                />

                {pConfig.label}
              </span>

              {/* DEADLINE */}
              <span
                className={clsx(
                  "flex items-center gap-1 text-xs font-medium",

                  isOverdue
                    ? "text-red-500"
                    : isDueToday
                    ? "text-orange-500"
                    : "text-gray-400"
                )}
              >
                {isOverdue ? (
                  <AlertCircle size={12} />
                ) : (
                  <Clock size={12} />
                )}

                {isOverdue
                  ? "Terlambat! "
                  : isDueToday
                  ? "Hari ini! "
                  : ""}

                {format(deadline, "d MMM yyyy", {
                  locale: id,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}