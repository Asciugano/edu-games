import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateLastActivity } from "./actions/user";

export async function proxy(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const { pathname } = req.nextUrl;

  if (session?.user) {
    await updateLastActivity(session.user.id);
  }

  const publicRoutes = [
    process.env.NEXT_PUBLIC_SIGN_IN_PAGE,
    process.env.NEXT_PUBLIC_SIGN_UP_PAGE,
  ];

  if (
    session &&
    (pathname === process.env.NEXT_PUBLIC_SIGN_IN_PAGE ||
      pathname === process.env.NEXT_PUBLIC_SIGN_UP_PAGE)
  )
    return NextResponse.redirect(
      new URL(process.env.NEXT_PUBLIC_SIGN_IN_PAGE!, req.url),
    );

  if (publicRoutes.includes(pathname)) return NextResponse.next();

  if (pathname.startsWith("/dashboard") && !session)
    return NextResponse.redirect(
      new URL(process.env.NEXT_PUBLIC_SIGN_IN_PAGE!, req.url),
    );

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
