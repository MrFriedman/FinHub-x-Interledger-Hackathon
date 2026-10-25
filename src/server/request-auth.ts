import { auth } from "@clerk/nextjs/server";
import { DEMO_SESSION_ID, DEMO_USER_ID } from "$/src/demo/demo-user";
import { isDemoMode } from "$/src/demo/mode";

export function getRequestAuth(): {
  userId: string | null;
  sessionId: string | null;
} {
  if (isDemoMode()) {
    return { userId: DEMO_USER_ID, sessionId: DEMO_SESSION_ID };
  }

  const session = auth();
  return { userId: session.userId, sessionId: session.sessionId };
}
