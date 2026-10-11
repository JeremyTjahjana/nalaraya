import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { safeNext } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const destination = new URL(
    next === "/atur-ulang-sandi"
      ? next
      : "/lanjut?next=" + encodeURIComponent(next),
    request.url,
  );
  const response = NextResponse.redirect(destination);
  if (code && url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(values) {
          values.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return response;
  }
  return NextResponse.redirect(
    new URL(
      "/masuk?error=callback&next=" + encodeURIComponent(next),
      request.url,
    ),
  );
}
