"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  loginSchema,
  registerSchema,
} from "@/lib/validations/auth";

export async function login(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // VALIDASI ZOD
  const validated = loginSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      error:
        validated.error.flatten().fieldErrors,
    };
  }

  const supabase =
    await createServerSupabaseClient();

  const { error } =
    await supabase.auth.signInWithPassword({
      email: validated.data.email,
      password: validated.data.password,
    });

  if (error) {
    return {
      serverError:
        "Email atau password salah",
    };
  }

  return {
    success: true,
  };
}

export async function register(
  formData: FormData
) {
  const rawData = {
    nama: formData.get("nama"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // VALIDASI ZOD
  const validated =
    registerSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      error:
        validated.error.flatten().fieldErrors,
    };
  }

  const supabase =
    await createServerSupabaseClient();

  const { error } =
    await supabase.auth.signUp({
      email: validated.data.email,
      password: validated.data.password,
      options: {
        data: {
          nama: validated.data.nama,
        },
      },
    });

  if (error) {
    return {
      serverError:
        "Gagal mendaftar: " + error.message,
    };
  }

  return {
    success:
      "Registrasi berhasil! Silakan login.",
  };
}

export async function logout() {
  const supabase =
    await createServerSupabaseClient();

  await supabase.auth.signOut();

  redirect("/auth/login");
}