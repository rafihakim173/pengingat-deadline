import Sidebar from "../../components/Sidebar";
import TugasList from "../../components/TugasList";
import { getTugasByUser } from "../../lib/actions/tugas";

export default async function TugasPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const tugas = await getTugasByUser();

  const filtered = tugas.filter((t) =>
    t.judul.toLowerCase().includes(
      (searchParams.search || "").toLowerCase()
    )
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="w-full p-6">
        <h1 className="text-2xl font-bold mb-5">
          Daftar Tugas
        </h1>

        <TugasList tugas={filtered} />
      </div>
    </div>
  );
}