import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { isDemoMode } from "$/src/demo/mode";

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  if (isDemoMode()) {
    return NextResponse.next();
  }

  const { runClerkMiddleware } = await import("$/src/server/clerk-middleware");
  return runClerkMiddleware(request, event);
}

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
