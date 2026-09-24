import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { defaultLocale, isLocale } from "@/lib/i18n";

// Anglais par défaut ; la langue choisie via le switch est mémorisée en cookie.
function pickLocale(req: NextRequest) {
  const cookie = req.cookies.get("locale")?.value;
  return cookie && isLocale(cookie) ? cookie : defaultLocale;
}

async function adminGate(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    },
  );
  const { data } = await supabase.auth.getClaims();
  const isLogin = req.nextUrl.pathname === "/admin/login";
  if (!data?.claims && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return res;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin")) return adminGate(req);
  if (pathname.startsWith("/auth")) return NextResponse.next();

  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|monitoring|icon|apple-icon|.*\\..*).*)"],
};
