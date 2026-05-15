export type Prioritas = "rendah" | "sedang" | "tinggi";

export interface Tugas {
  id: string;
  user_id: string;
  judul: string;
  deskripsi: string | null;
  deadline: string;
  prioritas: Prioritas;
  selesai: boolean;
  created_at: string;
}

export interface TugasFormData {
  judul: string;
  deskripsi: string;
  deadline: string;
  prioritas: Prioritas;
}
