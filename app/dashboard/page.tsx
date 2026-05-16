import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { getTugasByUser } from "@/lib/actions/tugas";

export default async function Dashboard() {
  let tugas = [];

  try {
    tugas = await getTugasByUser();
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">
          Dashboard
        </h1>

        <Link
          href="/tugas/tambah"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Tambah Tugas
        </Link>

        <div className="mt-6 space-y-3">
          {tugas.length === 0 ? (
            <div className="p-4 bg-white shadow rounded">
              Belum ada tugas
            </div>
          ) : (
            tugas.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white shadow rounded"
              >
                <h2 className="font-bold">
                  {item.judul}
                </h2>

                <p className="text-sm text-gray-500">
                  Prioritas: {item.prioritas}
                </p>

                <p className="text-sm text-gray-400">
                  Deadline: {item.deadline}
                </p>

                {item.deskripsi && (
                  <p className="mt-2 text-gray-700">
                    {item.deskripsi}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}