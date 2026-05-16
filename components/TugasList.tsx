"use client";

import {
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";

import {
  useOptimistic,
  useTransition,
} from "react";

import { Tugas } from "@/types";
import TugasCard from "./TugasCard";

export default function TugasList({
  tugas,
}: {
  tugas: Tugas[];
}) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const [isPending, startTransition] =
    useTransition();

  const [optimisticTugas, removeOptimistic] =
    useOptimistic(
      tugas,
      (state, id: string) =>
        state.filter(
          (item) => item.id !== id
        )
    );

  function handleSearch(term: string) {
    const params = new URLSearchParams(
      searchParams
    );

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.replace(
        `${pathname}?${params.toString()}`
      );
    });
  }

  return (
    <>
      <input
        type="text"
        placeholder="Cari tugas..."
        defaultValue={
          searchParams.get("search") || ""
        }
        onChange={(e) =>
          handleSearch(e.target.value)
        }
        className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3"
      />

      {isPending && (
        <p className="text-sm text-gray-400 mb-3">
          Mencari...
        </p>
      )}

      <div className="space-y-4">
        {optimisticTugas.length === 0 ? (
          <div className="bg-white border rounded-xl p-5 text-center text-gray-500">
            Tidak ada tugas ditemukan
          </div>
        ) : (
          optimisticTugas.map((t) => (
            <TugasCard
              key={t.id}
              tugas={t}
              onDeleteOptimistic={
                removeOptimistic
              }
            />
          ))
        )}
      </div>
    </>
  );
}