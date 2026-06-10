"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Tugas } from "@/types";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import clsx from "clsx";

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const prioritasColor: Record<string, string> = {
  tinggi: "bg-red-400",
  sedang: "bg-yellow-400",
  rendah: "bg-green-400",
};

export default function KalenderPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTugas = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("tugas")
      .select("*")
      .eq("user_id", user.id)
      .order("deadline", { ascending: true });

    setTugas(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTugas(); }, [fetchTugas]);

  // Build calendar days (including padding from prev/next month)
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  function tugasPadaHari(date: Date) {
    return tugas.filter((t) => isSameDay(new Date(t.deadline), date));
  }

  const selectedTugas = selectedDate ? tugasPadaHari(selectedDate) : [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="text-blue-600" size={26} />
          Kalender Deadline
        </h1>
        <p className="text-gray-500 mt-1">
          Pantau semua deadline dalam tampilan kalender
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <h2 className="font-bold text-gray-800 text-lg">
            {format(currentDate, "MMMM yyyy", { locale: id })}
          </h2>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Hari Headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {HARI.map((h) => (
            <div key={h} className="py-3 text-center text-xs font-bold text-gray-400 uppercase">
              {h}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              const dayTugas = tugasPadaHari(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              const todayDay = isToday(day);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(isSameDay(day, selectedDate!) ? null : day)}
                  className={clsx(
                    "min-h-[72px] p-2 border-b border-r border-gray-50 text-left transition hover:bg-blue-50/50",
                    !isCurrentMonth && "opacity-30",
                    isSelected && "bg-blue-50",
                    todayDay && "bg-blue-600/5"
                  )}
                >
                  <span
                    className={clsx(
                      "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold mb-1",
                      todayDay
                        ? "bg-blue-600 text-white"
                        : "text-gray-700"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <div className="space-y-0.5">
                    {dayTugas.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className={clsx(
                          "w-full h-1.5 rounded-full",
                          prioritasColor[t.prioritas]
                        )}
                      />
                    ))}
                    {dayTugas.length > 3 && (
                      <p className="text-xs text-gray-400">+{dayTugas.length - 3}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Tugas Panel */}
      {selectedDate && (
        <div className="mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4">
            📅 {format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })}
            <span className="ml-2 text-sm text-gray-400 font-normal">
              ({selectedTugas.length} tugas)
            </span>
          </h3>

          {selectedTugas.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">
              Tidak ada tugas pada tanggal ini
            </p>
          ) : (
            <div className="space-y-3">
              {selectedTugas.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                >
                  <div
                    className={clsx(
                      "w-3 h-3 rounded-full shrink-0",
                      prioritasColor[t.prioritas]
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={clsx(
                        "text-sm font-semibold text-gray-700",
                        t.selesai && "line-through text-gray-400"
                      )}
                    >
                      {t.judul}
                    </p>
                    {t.deskripsi && (
                      <p className="text-xs text-gray-400 truncate">{t.deskripsi}</p>
                    )}
                  </div>
                  {t.selesai && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium shrink-0">
                      Selesai
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 justify-center">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
          Prioritas Tinggi
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
          Prioritas Sedang
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
          Prioritas Rendah
        </span>
      </div>
    </div>
  );
}
