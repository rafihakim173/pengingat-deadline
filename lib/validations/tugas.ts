import { z } from "zod";

export const tugasSchema = z.object({
judul: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(100, "Judul terlalu panjang"),

    deskripsi: z.string().optional(),

    deadline: z.string().min(1, "Deadline wajib diisi"),

    prioritas: z.enum(["rendah", "sedang", "tinggi"]),
});