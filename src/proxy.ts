import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { auth } from "@/lib/auth";
import { updateLastActivity } from "@/actions/user";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function stripLocale(pathname: string) {
  const regex = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

  const stripped = pathname.replace(regex, "");
  return stripped || "/";
}

export async function proxy(req: NextRequest) {
  // Lascia gestire a next-intl redirect, rewrite e cookie
  const response = intlMiddleware(req);

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (session?.user) {
    await updateLastActivity(session.user.id);
  }

  const pathname = stripLocale(req.nextUrl.pathname);

  const signIn = process.env.NEXT_PUBLIC_SIGN_IN_PAGE!;
  const signUp = process.env.NEXT_PUBLIC_SIGN_UP_PAGE!;

  const publicRoutes = [signIn, signUp];

  // Utente già autenticato
  if (session && publicRoutes.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";

    return NextResponse.redirect(url);
  }

  // Dashboard protetta
  if (pathname.startsWith("/dashboard") && !session) {
    const url = req.nextUrl.clone();
    url.pathname = signIn;

    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
