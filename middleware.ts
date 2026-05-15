import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },

        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });

          response.cookies.set({
            name,
            value,
            ...options,
          });
        },

        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });

          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/dashboard", "/tugas", "/kalender"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/tugas/:path*", "/kalender/:path*"],
};