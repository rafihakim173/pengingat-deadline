"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { TugasFormData } from "@/types";
import { tugasSchema } from "@/lib/validations/tugas";

export async function simpanTugas(data: TugasFormData) {
  // VALIDASI ZOD
  const validated = tugasSchema.safeParse(data);

  if (!validated.success) {
    return {
      error: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();

  // CEK LOGIN
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      serverError: "Anda harus login terlebih dahulu",
    };
  }

  // INSERT DATA
  const { error } = await supabase.from("tugas").insert({
    user_id: user.id,
    judul: validated.data.judul,
    deskripsi: validated.data.deskripsi || null,
    deadline: validated.data.deadline,
    prioritas: validated.data.prioritas,
    selesai: false,
  });

  if (error) {
    return {
      serverError: "Gagal menyimpan tugas: " + error.message,
    };
  }

  // REFRESH CACHE
  revalidatePath("/dashboard");
  revalidatePath("/tugas");
  revalidatePath("/kalender");

  return {
    success: true,
  };
}

export async function toggleSelesai(
  id: string,
  selesai: boolean
) {
  const supabase = await createServerSupabaseClient();

  // CEK LOGIN
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // UPDATE STATUS
  const { error } = await supabase
    .from("tugas")
    .update({
      selesai: !selesai,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return {
      error: "Gagal mengupdate tugas",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/tugas");
  revalidatePath("/kalender");

  return {
    success: true,
  };
}

export async function hapusTugas(id: string) {
  const supabase = await createServerSupabaseClient();

  // CEK LOGIN
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // DELETE DATA
  const { error } = await supabase
    .from("tugas")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return {
      error: "Gagal menghapus tugas",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/tugas");
  revalidatePath("/kalender");

  return {
    success: true,
  };
}

export async function getTugasByUser() {
  const supabase = await createServerSupabaseClient();

  // CEK LOGIN
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // GET DATA USER
  const { data, error } = await supabase
    .from("tugas")
    .select("*")
    .eq("user_id", user.id)
    .order("deadline", {
      ascending: true,
    });

  if (error) {
    console.error(error);

    return [];
  }

  return data || [];
}