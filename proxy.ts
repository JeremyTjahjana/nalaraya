import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { refreshSession } from "./lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  if (
    process.env.NODE_ENV === "development" &&
    request.nextUrl.hostname === "0.0.0.0"
  ) {
    const destination = request.nextUrl.clone();
    destination.hostname = "localhost";
    return NextResponse.redirect(destination);
  }
  const { response, user } = await refreshSession(request);
  const path = request.nextUrl.pathname;
  const protectedPath = path === "/dashboard" || path.endsWith("/praktikum");
  if (!user && protectedPath) {
    const destination = new URL("/masuk", request.url);
    destination.searchParams.set("next", path + request.nextUrl.search);
    const redirect = NextResponse.redirect(destination);
    response.cookies
      .getAll()
      .forEach(({ name, value, ...options }) =>
        redirect.cookies.set(name, value, options),
      );
    return redirect;
  }
  return response;
}

export const config = {
  matcher: [
    "/masuk/:path*",
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/lanjut/:path*",
    "/auth/:path*",
    "/kimia/titrasi/praktikum/:path*",
    "/biologi/epidermis-bawang/praktikum/:path*",
  ],
};
