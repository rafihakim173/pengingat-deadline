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

        set(name: string, value: string, options: Record<string, any>) {
          const response = NextResponse.next({
  request: {
    headers: request.headers,
  },
});

          response.cookies.set({
            name,
            value,
            ...options,
          });
        },

        remove(name: string, options: Record<string, any>) {
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
    const loginUrl = new URL("/auth/login", request.url);

      loginUrl.searchParams.set(
        "redirectTo",
          pathname
        );

      return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/tugas/:path*", "/kalender/:path*"],
};