"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useOptimistic } from "react";
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

  const [optimisticTugas, removeOptimistic] = useOptimistic(
    tugas,
    (state, id: string) =>
      state.filter((item) => item.id !== id)
  );

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <input
        type="text"
        placeholder="Cari tugas..."
        defaultValue={searchParams.get("search") || ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-5"
      />

      <div className="space-y-4">
        {optimisticTugas.map((t) => (
          <TugasCard
            key={t.id}
            tugas={t}
            onDeleteOptimistic={removeOptimistic}
          />
        ))}
      </div>
    </>
  );
}