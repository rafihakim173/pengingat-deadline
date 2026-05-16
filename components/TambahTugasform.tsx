"use client";

import { useState } from "react";
import { simpanTugas } from "../lib/actions/tugas";
import { Prioritas } from "../types";
import { Plus, Loader2 } from "lucide-react";
import Toast from "./Toast";
import clsx from "clsx";


const prioritasOptions: {
  value: Prioritas;
  label: string;
  color: string;
  active: string;
}[] = [
  {
    value: "rendah",
    label: "🟢 Rendah",
    color: "border-green-200 text-green-700 bg-green-50",
    active: "border-green-500 bg-green-500 text-white",
  },
  {
    value: "sedang",
    label: "🟡 Sedang",
    color: "border-yellow-200 text-yellow-700 bg-yellow-50",
    active: "border-yellow-500 bg-yellow-500 text-white",
  },
  {
    value: "tinggi",
    label: "🔴 Tinggi",
    color: "border-red-200 text-red-700 bg-red-50",
    active: "border-red-500 bg-red-500 text-white",
  },
];

export default function TambahTugasForm() {
  ;
  const [loading, setLoading] = useState(false);

  const [prioritas, setPrioritas] =
    useState<Prioritas>("sedang");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [errors, setErrors] = useState<any>({});

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    const form = e.currentTarget;

    const formData = new FormData(form);

    const result = await simpanTugas({
      judul: formData.get("judul") as string,
      deskripsi: formData.get("deskripsi") as string,
      deadline: formData.get("deadline") as string,
      prioritas,
    });
    

    setLoading(false);

    // VALIDATION ERROR
    if (result?.error) {
      setErrors(result.error);

      setToast({
        message: "Form tidak valid",
        type: "error",
      });

      return;
    }

    // SERVER ERROR
    if (result?.serverError) {
      setToast({
        message: result.serverError,
        type: "error",
      });

      return;
    }

    // SUCCESS
    setErrors({});

    setToast({  
      message: "✅ Tugas berhasil disimpan!",
      type: "success",
    });
      

    form.reset();

    setPrioritas("sedang");
  }

  // MIN DATE = TODAY
  const today = new Date()
    .toISOString()
    .split("T")[0];

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
          <Plus size={20} className="text-blue-500" />
          Tambah Tugas Baru
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* JUDUL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Judul Tugas{" "}
              <span className="text-red-400">*</span>
            </label>

            <input
              name="judul"
              type="text"
              placeholder="Contoh: Kerjakan laporan mingguan"
              className={clsx(
                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition",
                errors?.judul
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-200 focus:ring-blue-500"
              )}
            />

            {errors?.judul && (
              <p className="text-red-500 text-sm mt-1">
                {errors.judul[0]}
              </p>
            )}
          </div>

          {/* DESKRIPSI */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi{" "}
              <span className="text-gray-400 font-normal">
                (opsional)
              </span>
            </label>

            <textarea
              name="deskripsi"
              rows={3}
              placeholder="Detail tambahan tentang tugas ini..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 transition resize-none"
            />
          </div>

          {/* DEADLINE */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deadline{" "}
              <span className="text-red-400">*</span>
            </label>

            <input
              name="deadline"
              type="date"
              min={today}
              className={clsx(
                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-gray-800 transition",
                errors?.deadline
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-200 focus:ring-blue-500"
              )}
            />

            {errors?.deadline && (
              <p className="text-red-500 text-sm mt-1">
                {errors.deadline[0]}
              </p>
            )}
          </div>

          {/* PRIORITAS */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Prioritas{" "}
              <span className="text-red-400">*</span>
            </label>

            <div className="flex gap-3">
              {prioritasOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setPrioritas(opt.value)
                  }
                  className={clsx(
                    "flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all",
                    prioritas === opt.value
                      ? opt.active
                      : opt.color
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Plus size={18} />
                <span>Simpan Tugas</span>
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}